import type { Order, PaidOrder, PlanKey, PortfolioData, ProductKind, Project, Publication, Rsvp, Template, User, Wish } from "@/lib/types";

export type RsvpInput = Pick<Rsvp, "name" | "attendance" | "guests" | "message">;

export type TemplatePatch = Partial<Pick<Template, "name" | "category" | "description" | "tags" | "published" | "theme" | "sections" | "pages" | "kind" | "style">>;

export interface AdminStats {
  users: number;
  projects: number;
  published: number;
  /** Jumlah proyek per templateId */
  usage: Record<string, number>;
}

// Antarmuka penyimpanan. Ada dua implementasi:
//  - local    : file JSON di ./data (tanpa konfigurasi, untuk mencoba)
//  - supabase : Supabase Auth + PostgreSQL + Storage (untuk produksi)

export type AuthResult = { ok: true } | { ok: false; error: string };

export interface Backend {
  mode: "local" | "supabase";

  getCurrentUser(): Promise<User | null>;
  signUp(name: string, email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;

  listProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | null>;
  createProject(userId: string, input: { name: string; templateId: string; kind: ProductKind; data: PortfolioData }): Promise<Project>;
  updateProject(id: string, userId: string, patch: { name?: string; data?: PortfolioData }): Promise<void>;
  deleteProject(id: string, userId: string): Promise<void>;

  /** Mengembalikan pesan error jika slug sudah dipakai. */
  publish(projectId: string, userId: string, slug: string): Promise<string | null>;
  unpublish(projectId: string, userId: string): Promise<void>;
  getPublication(slug: string): Promise<Publication | null>;

  uploadImage(userId: string, file: File): Promise<string>;

  // ---- Template buatan admin ----
  listTemplates(opts?: { includeDrafts?: boolean }): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | null>;
  createTemplate(userId: string, template: Template): Promise<Template>;
  updateTemplate(id: string, patch: TemplatePatch): Promise<void>;
  deleteTemplate(id: string): Promise<void>;
  adminStats(): Promise<AdminStats>;

  // ---- RSVP undangan ----
  /** Menyimpan RSVP untuk undangan yang terbit; null jika undangan tidak ditemukan. */
  addRsvp(slug: string, input: RsvpInput): Promise<Rsvp | null>;
  /** Semua RSVP milik proyek (hanya pemilik). */
  listRsvps(projectId: string, userId: string): Promise<Rsvp[]>;
  /** Ucapan publik untuk ditampilkan di undangan. */
  listWishes(slug: string): Promise<Wish[]>;

  // ---- Paket & pembayaran ----
  createOrder(userId: string, input: { plan: PlanKey; projectId: string | null }): Promise<Order>;
  /** Pesanan milik pengguna (null jika bukan miliknya). */
  getOrder(id: string, userId: string): Promise<Order | null>;
  listOrders(userId: string): Promise<Order[]>;
  /** Mengirim bukti transfer; hanya untuk pesanan yang belum lunas. */
  submitOrderProof(id: string, userId: string, input: { proofUrl: string; senderName: string }): Promise<boolean>;
  /** Pesanan lunas milik pengguna (dasar hak akses). */
  paidOrders(userId: string): Promise<PaidOrder[]>;
  /** Semua pesanan, lengkap dengan nama pembeli & proyek (khusus admin). */
  adminListOrders(): Promise<Order[]>;
  /** Admin menandai lunas / menolak. */
  setOrderStatus(id: string, adminId: string, status: "lunas" | "ditolak", note: string): Promise<void>;
}
