'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import Image from 'next/image';
import React from 'react';

const TeamMembers = () => {
    const { projectId } = useProject();
    const { data: members } = api.project.getTeamMembers.useQuery({ projectId });
    console.log(members);

    return (
        <div className='flex items-center gap-2'>
            {members?.map((member) => (
                <HoverCard key={member.id}>
                    <HoverCardTrigger asChild>
                        <Image
                            src={member.user.imageUrl!}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            height={30}
                            width={30}
                            className='rounded-full'
                        />
                    </HoverCardTrigger>
                    <HoverCardContent className='w-60 p-4'>
                        <div className='flex flex-col items-start'>
                            <Image
                                src={member.user.imageUrl!}
                                alt={`${member.user.firstName} ${member.user.lastName}`}
                                height={50}
                                width={50}
                                className='rounded-full mb-2'
                            />
                            <p className='text-sm font-semibold'>
                                {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className='text-xs text-gray-500'>{member.user.emailAddress}</p>
                            <p className='text-xs text-gray-400 mt-1'>
                                Joined on: {new Date(member.user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </div>
    );
};

export default TeamMembers;
