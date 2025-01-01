"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useRefetch from "../../../hooks/use-refetch";

type FormInput = {
    repoUrl: string;
    projectName: string;
    branch: "main" | "master";
    githubToken?: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset, setValue, watch } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    const selectedBranch = watch("branch");

    function onSubmit(data: FormInput) {
        createProject.mutate(
            {
                githubUrl: data.repoUrl,
                name: data.projectName,
                branch: data.branch,
                githubToken: data.githubToken,
            },
            {
                onSuccess: () => {
                    toast.success("Project created successfully");
                    refetch();
                    reset();
                },
                onError: () => {
                    toast.error("Failed to create project!");
                },
            }
        );
        return true;
    }

    return (
        <div className="flex items-center gap-12 h-full justify-center">
            <img src={"/undraw_github.svg"} alt="github image" className="h-56 w-auto" />
            <div>
                <div>
                    <h1 className="font-semibold text-2xl">Link your Github Repository</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your repository to link it to DevInsight
                    </p>
                </div>
                <div className="h-4"></div>

                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input {...register("projectName", { required: true })} placeholder="Project Name" required />
                        <div className="h-2"></div>

                        <Input {...register("repoUrl", { required: true })} placeholder="Repository URL" type="url" required />
                        <div className="h-2"></div>

                        <Input {...register("githubToken")} placeholder="Github Token (Optional)" />
                        <div className="h-2"></div>

                        <Select
                            onValueChange={(value) => setValue("branch", value as "main" | "master")}
                            defaultValue="main"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="main">main</SelectItem>
                                <SelectItem value="master">master</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="h-4"></div>

                        <Button type="submit" disabled={createProject.isPending || !selectedBranch}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
