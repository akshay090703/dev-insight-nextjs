'use client'

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import AskQuestionCard from "../dashboard/ask-question-card";
import React, { useState } from "react";
import Image from "next/image";
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from "../dashboard/code-references";

const QAPage = () => {
    const { projectId } = useProject();
    const { data: questions } = api.project.getQuestions.useQuery({ projectId });

    const [questionIndex, setQuestionIndex] = useState(0);
    const question = questions?.[questionIndex];

    return (
        <Sheet>
            <AskQuestionCard />
            <div className="h-4"></div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Saved Questions</h1>
            <div className="h-2"></div>

            <div className="flex flex-col gap-2">
                {questions?.map((question, index) => (
                    <React.Fragment key={question.id}>
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 rounded-lg p-4 shadow border bg-card dark:bg-gray-800 dark:border-gray-700">
                                <Image
                                    className="rounded-full"
                                    height={30}
                                    width={30}
                                    src={question.user.imageUrl ?? ""}
                                    alt="avatar image"
                                />
                                <div className="text-left flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-700 dark:text-gray-200 line-clamp-1 text-lg font-medium">
                                            {question.question}
                                        </p>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            {question.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 line-clamp-1 text-sm">
                                        {question.answer}
                                    </p>
                                </div>
                            </div>
                        </SheetTrigger>
                    </React.Fragment>
                ))}
            </div>

            {question && (
                <SheetContent className="sm:max-w-[80vw] overflow-scroll bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col gap-2">
                    <SheetHeader>
                        {question.question}
                    </SheetHeader>
                    <MDEditor.Markdown className="p-2 rounded-md" source={question.answer} />
                    <CodeReferences fileReferences={(question.fileReferences ?? []) as any} />
                </SheetContent>
            )}
        </Sheet>
    );
};

export default QAPage;
