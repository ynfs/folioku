import "server-only";
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import type { PortfolioData, Project, Role, Rsvp, Template, User } from "@/lib/types";
import type { AdminStats, AuthResult, Backend } from "./types";

// MODE LOKAL: semua data disimpan di ./data/db.json dan gambar di ./data/uploads.
// Cocok untuk mencoba di komputer sendiri. Untuk produksi gunakan Supabase.

const DATA_DIR = process.env.SAFANTARA_DATA_DIR || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const COOKIE = "safantara_session";
const SESSION_DAYS = 30;

interface StoredUser extends User {
  passwordHash: string;
  createdAt: string;
}
interface StoredTemplate extends Template {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
interface StoredRsvp extends Rsvp {
  projectId: string;
}
interface DB {
  users: StoredUser[];
  projects: Project[];
  templates: StoredTemplate[];
  rsvps: StoredRsvp[];
}

let queue: Promise<unknown> = Promise.resolve();

async function readDB(): Promise<DB> {
  try {
    const db = JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Partial<DB>;
    return { users: db.users ?? [], projects: db.projects ?? [], templates: db.templates ?? [], rsvps: db.rsvps ?? [] };
  } catch {
    return { users: [], projects: [], templates: [], rsvps: [] };
  }
}

/** Menjalankan perubahan secara berurutan agar file tidak saling menimpa. */
function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDB();
    const result = await fn(db);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DB_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, DB_FILE);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

/**
 * Kunci penanda tangan cookie sesi. Selalu dibaca dari file (tidak di-cache per modul)
 * agar semua bagian server — server action dan route handler — memakai kunci yang sama.
 */
async function secret(): Promise<string> {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const file = path.join(DATA_DIR, ".secret");
  try {
    return (await fs.readFile(file, "utf8")).trim();
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      // "wx": gagal jika file sudah dibuat proses lain, lalu kita baca milik mereka.
      await fs.writeFile(file, randomBytes(32).toString("hex"), { flag: "wx" });
    } catch {
      /* sudah ada */
    }
    return (await fs.readFile(file, "utf8")).trim();
  }
}

const sign = (value: string, key: string) => createHmac("sha256", key).update(value).digest("base64url");

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function setSession(userId: string) {
  const exp = Date.now() + SESSION_DAYS * 86400_000;
  const payload = `${userId}.${exp}`;
  const value = `${payload}.${sign(payload, await secret())}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

async function sessionUserId(): Promise<string | null> {
  const store = await cookies();
  // Cookie lama (sebelum ganti nama ke Safantara) tetap diterima agar pengguna tidak keluar.
  const raw = store.get(COOKIE)?.value ?? store.get("folioku_session")?.value;
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = sign(`${userId}.${exp}`, await secret());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now()) return null;
  return userId;
}

const publicUser = ({ id, name, email, role }: StoredUser): User => ({ id, name, email, role });

export const localBackend: Backend = {
  mode: "local",

  async getCurrentUser() {
    const id = await sessionUserId();
    if (!id) return null;
    const user = (await readDB()).users.find((u) => u.id === id);
    return user ? publicUser(user) : null;
  },

  async signUp(name, email, password): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase();
    const result = await mutate((db) => {
      if (db.users.some((u) => u.email === normalized)) return null;
      // Pengguna pertama otomatis menjadi admin.
      const role: Role = db.users.length === 0 ? "admin" : "client";
      const user: StoredUser = {
        id: randomUUID(),
        name: name.trim(),
        email: normalized,
        role,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      return user.id;
    });
    if (!result) return { ok: false, error: "Email sudah terdaftar." };
    await setSession(result);
    return { ok: true };
  },

  async signIn(email, password): Promise<AuthResult> {
    const user = (await readDB()).users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { ok: false, error: "Email atau password salah." };
    }
    await setSession(user.id);
    return { ok: true };
  },

  async signOut() {
    const store = await cookies();
    store.delete(COOKIE);
    store.delete("folioku_session");
  },

  async listProjects(userId) {
    return (await readDB()).projects
      .filter((p) => p.ownerId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getProject(id, userId) {
    return (await readDB()).projects.find((p) => p.id === id && p.ownerId === userId) ?? null;
  },

  async createProject(userId, { name, templateId, kind, data }) {
    const now = new Date().toISOString();
    const project: Project = {
      id: randomUUID(),
      ownerId: userId,
      templateId,
      kind,
      name,
      data,
      createdAt: now,
      updatedAt: now,
      slug: null,
      published: false,
    };
    await mutate((db) => {
      db.projects.push(project);
    });
    return project;
  },

  async updateProject(id, userId, patch) {
    await mutate((db) => {
      const p = db.projects.find((x) => x.id === id && x.ownerId === userId);
      if (!p) throw new Error("Proyek tidak ditemukan");
      if (patch.name !== undefined) p.name = patch.name;
      if (patch.data !== undefined) p.data = patch.data as PortfolioData;
      p.updatedAt = new Date().toISOString();
    });
  },

  async deleteProject(id, userId) {
    await mutate((db) => {
      const before = db.projects.length;
      db.projects = db.projects.filter((p) => !(p.id === id && p.ownerId === userId));
      if (db.projects.length !== before) db.rsvps = db.rsvps.filter((r) => r.projectId !== id);
    });
  },

  async publish(projectId, userId, slug) {
    return mutate((db) => {
      if (db.projects.some((p) => p.slug === slug && p.id !== projectId)) {
        return "Alamat ini sudah dipakai. Coba yang lain.";
      }
      const p = db.projects.find((x) => x.id === projectId && x.ownerId === userId);
      if (!p) return "Proyek tidak ditemukan.";
      p.slug = slug;
      p.published = true;
      return null;
    });
  },

  async unpublish(projectId, userId) {
    await mutate((db) => {
      const p = db.projects.find((x) => x.id === projectId && x.ownerId === userId);
      if (p) p.published = false;
    });
  },

  async getPublication(slug) {
    const db = await readDB();
    const p = db.projects.find((x) => x.slug === slug && x.published);
    if (!p) return null;
    const owner = db.users.find((u) => u.id === p.ownerId);
    return { slug, kind: p.kind ?? "portfolio", name: p.name, data: p.data, ownerName: owner?.name ?? "" };
  },

  async uploadImage(_userId, file) {
    const ext = file.type === "audio/mpeg" ? "mp3" : (file.type.split("/")[1] || "png").replace("jpeg", "jpg");
    const name = `${randomUUID()}.${ext}`;
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    return `/api/files/${name}`;
  },

  async listTemplates(opts) {
    const { templates } = await readDB();
    return templates
      .filter((t) => opts?.includeDrafts || t.published)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(toTemplate);
  },

  async getTemplate(id) {
    const t = (await readDB()).templates.find((x) => x.id === id);
    return t ? toTemplate(t) : null;
  },

  async createTemplate(userId, template) {
    const now = new Date().toISOString();
    const stored: StoredTemplate = { ...template, builtin: false, createdBy: userId, createdAt: now, updatedAt: now };
    await mutate((db) => {
      db.templates.push(stored);
    });
    return toTemplate(stored);
  },

  async updateTemplate(id, patch) {
    await mutate((db) => {
      const t = db.templates.find((x) => x.id === id);
      if (!t) throw new Error("Template tidak ditemukan");
      Object.assign(t, patch, { updatedAt: new Date().toISOString() });
    });
  },

  async deleteTemplate(id) {
    await mutate((db) => {
      db.templates = db.templates.filter((t) => t.id !== id);
    });
  },

  async adminStats(): Promise<AdminStats> {
    const db = await readDB();
    const usage: Record<string, number> = {};
    for (const p of db.projects) usage[p.templateId] = (usage[p.templateId] ?? 0) + 1;
    return { users: db.users.length, projects: db.projects.length, published: db.projects.filter((p) => p.published).length, usage };
  },

  async addRsvp(slug, input) {
    return mutate((db) => {
      const p = db.projects.find((x) => x.slug === slug && x.published);
      if (!p) return null;
      if (db.rsvps.filter((r) => r.projectId === p.id).length >= MAX_RSVP_PER_PROJECT) return null;
      const rsvp: StoredRsvp = { ...input, id: randomUUID(), projectId: p.id, createdAt: new Date().toISOString() };
      db.rsvps.push(rsvp);
      const { projectId: _omit, ...pub } = rsvp;
      void _omit;
      return pub;
    });
  },

  async listRsvps(projectId, userId) {
    const db = await readDB();
    if (!db.projects.some((p) => p.id === projectId && p.ownerId === userId)) return [];
    return db.rsvps
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ projectId: _omit, ...r }) => (void _omit, r));
  },

  async listWishes(slug) {
    const db = await readDB();
    const p = db.projects.find((x) => x.slug === slug && x.published);
    // Respon proposal bersifat rahasia: hanya pemilik yang boleh melihat.
    if (!p || p.kind === "proposal") return [];
    return db.rsvps
      .filter((r) => r.projectId === p.id && r.message)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 200)
      .map(({ id, name, attendance, message, createdAt }) => ({ id, name, attendance, message, createdAt }));
  },
};

const MAX_RSVP_PER_PROJECT = 5000;

function toTemplate(t: StoredTemplate): Template {
  const { id, name, category, style, description, tags, kind, theme, sections, pages, published, updatedAt } = t;
  return { id, name, category, style, description, tags, kind: kind ?? "portfolio", theme, sections, pages: pages ?? [], published: !!published, builtin: false, updatedAt };
}
