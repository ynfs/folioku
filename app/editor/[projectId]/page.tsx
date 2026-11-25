import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { backend, requireUser } from "@/lib/backend";

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage(props: PageProps<"/editor/[projectId]">) {
  const { projectId } = await props.params;
  const user = await requireUser(`/editor/${projectId}`);
  const project = await backend.getProject(projectId, user.id);
  if (!project) notFound();
  return <Editor key={project.id} project={project} />;
}
