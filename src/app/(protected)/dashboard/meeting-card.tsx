'use client';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { Card } from '@/components/ui/card';
import { uploadFile } from '@/lib/firebase';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { Loader, Presentation, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import useProject from '@/hooks/use-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const MeetingCard = () => {
    const { project } = useProject()
    const processMeeting = useMutation({
        mutationFn: async (data: { meetingUrl: string, meetingId: string, projectId: string }) => {
            const { meetingUrl, meetingId, projectId } = data
            const response = await axios.post('/api/process-meeting', { meetingUrl, meetingId, projectId })

            return response.data;
        }
    })

    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const uploadMeeting = api.project.uploadMeeting.useMutation();

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a']
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async acceptedFiles => {
            if (!project) return

            setIsUploading(true)
            const acceptedFile = acceptedFiles[0];
            const downloadUrl = await uploadFile(acceptedFile as File, setProgress) as string

            if (!acceptedFile) return

            uploadMeeting.mutate({
                projectId: project!.id,
                meetingUrl: downloadUrl,
                name: acceptedFile!.name
            }, {
                onSuccess: (meeting) => {
                    toast.success("Meeting uploaded successfully");
                    router.push('/meetings')
                    processMeeting.mutateAsync({ meetingUrl: downloadUrl, meetingId: meeting.id, projectId: project.id })
                },
                onError: () => {
                    toast.error("Failed to upload meeting!");
                }
            })

            // window.alert(downloadUrl)
            setIsUploading(false)
        }
    });

    return (
        <Card className='col-span-2 flex flex-col items-center justify-center p-10' {...getRootProps()}>
            {
                !isUploading &&
                <>
                    <Presentation className='h-10 w-10 animate-bounce' />
                    <h3 className="mt-2 text-sm font-semibold text-gray-700">
                        Create a new meeting
                    </h3>
                    <p className="mt-1 text-center text-sm text-gray-500">
                        Analyse your meeting with DevInsight
                        <br />
                        Powered by AI.
                    </p>

                    <div className="mt-6">
                        <Button disabled={isUploading}>
                            {isUploading ? <Loader className='-mt-0.5 mr-1.5 h-5 w-5' /> : <Upload className='-mt-0.5 mr-1.5 h-5 w-5' aria-hidden="true" />}
                            Upload Meeting
                            <input className='hidden' {...getInputProps()} />
                        </Button>
                    </div>
                </>
            }

            {isUploading && (
                <div className='flex flex-col justify-center items-center'>
                    <CircularProgressbar value={progress} text={`${progress}%`} className='size-20' styles={buildStyles({
                        textColor: '#2563eb',
                        pathColor: '#2563eb',
                        trailColor: '#2563eb',
                    })} />
                    <p className="text-sm text-gray-500 text-center">Uploading your meeting...</p>
                </div>
            )}
        </Card>
    )
}

export default MeetingCard