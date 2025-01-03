'use client'

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react"
import { toast } from "sonner";
import useRefetch from '@/hooks/use-refetch';
import { Button } from "@/components/ui/button";

const ArchiveButton = () => {
    const { projectId } = useProject()
    const archiveProject = api.project.archiveProject.useMutation();
    const refetch = useRefetch();

    return (
        <Button disabled={archiveProject.isPending} size={'sm'} variant={'destructive'} onClick={() => {
            const confirm = window.confirm("Are you sure you want to archive this project?")
            if (confirm) {
                archiveProject.mutate({ projectId: projectId }, {
                    onSuccess: () => {
                        toast.success("Project archived successfully")
                        refetch();
                    },
                    onError: () => {
                        toast.error("Failed to archive project!")
                    }
                });
            }
        }}>
            Archive
        </Button>
    )
}

export default ArchiveButton