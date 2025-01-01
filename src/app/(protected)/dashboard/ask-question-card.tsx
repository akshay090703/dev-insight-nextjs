'use client'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import React from 'react'
import { useState } from 'react';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import CodeReferences from './code-references';

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileReferences, setFileReferences] = useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [answer, setAnswer] = useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFileReferences([])

        e.preventDefault();
        if (!project?.id) return;
        setLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id);
        setOpen(true)
        setFileReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta);
            }
        }

        setLoading(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-w-[70vw] max-h-[90vh] overflow-scroll'>
                    <DialogHeader>
                        <DialogTitle>
                            Logo
                        </DialogTitle>
                    </DialogHeader>

                    <MDEditor.Markdown source={answer} className='max-w-full h-full max-h-[40vh] overflow-scroll' />
                    <CodeReferences fileReferences={fileReferences} />

                    <Button type='button' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Which file should i edit to change the home page?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="h-4"></div>

                        <Button type='submit' disabled={loading}>
                            Ask DevInsight!
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard