import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { backend, requireUser } from "@/lib/backend";

export const metadata: Metadata = { title: "Editor template" };

export default async function TemplateEditorPage(props: PageProps<"/admin/templates/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/admin/templates/${id}`);
  if (user.role !== "admin") redirect("/dashboard");
  const template = await backend.getTemplate(id);
  if (!template) notFound();
  return <Editor key={template.id} mode={{ kind: "template", template }} />;
}
