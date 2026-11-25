import type { PortfolioData, Project, Publication, User } from "@/lib/types";

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
  createProject(userId: string, input: { name: string; templateId: string; data: PortfolioData }): Promise<Project>;
  updateProject(id: string, userId: string, patch: { name?: string; data?: PortfolioData }): Promise<void>;
  deleteProject(id: string, userId: string): Promise<void>;

  /** Mengembalikan pesan error jika slug sudah dipakai. */
  publish(projectId: string, userId: string, slug: string): Promise<string | null>;
  unpublish(projectId: string, userId: string): Promise<void>;
  getPublication(slug: string): Promise<Publication | null>;

  uploadImage(userId: string, file: File): Promise<string>;
}
