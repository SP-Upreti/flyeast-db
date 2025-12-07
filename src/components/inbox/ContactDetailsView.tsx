"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { api } from "@/services/api";
import Breadcumb from "@/components/dashboard/Breadcumb";
import type { Contact } from "@/types/contact";

interface ContactDetailsViewProps {
    contactId: string;
    onBack: () => void;
}

export function ContactDetailsView({ contactId, onBack }: ContactDetailsViewProps) {
    const [contact, setContact] = useState<Contact | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            if (!contactId) return;

            setIsLoading(true);
            try {
                const { data } = await api.get(`contact/${contactId}`);
                setContact(data.data);
            } catch (error) {
                toast.error("Failed to fetch contact details");
                onBack(); // Return to list if fetch fails
            } finally {
                setIsLoading(false);
            }
        };

        fetchContact();
    }, [contactId, onBack]);

    const links = [
        {
            to: "/dashboard/admin/contacts",
            label: "Contacts",
            isActive: false,
        },
        {
            to: "#",
            label: "Contact Details",
            isActive: true,
        },
    ];

    if (isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <Breadcumb links={links} />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-2 border">
                    {/* Header Card Skeleton */}
                    <Card className="border-b">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Contact Information Skeleton */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-20 mb-2" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-24" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="w-full">
                <Breadcumb links={links} />
                <div className="flex items-center justify-center h-64">
                    <p className="text-zinc-500">Contact not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <Breadcumb links={links} />
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Contacts
                </Button>
            </div>

            <div className="grid gap-2 border">
                {/* Header Card */}
                <Card className="border-b">
                    <CardHeader className="">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{contact.name}</CardTitle>
                                <p className="text-zinc-500 mt-1">{contact.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={contact.seen ? "outline" : "default"}
                                    className={
                                        contact.seen
                                            ? "py-1 text-zinc-500"
                                            : "py-1 bg-red-600 text-white"
                                    }
                                >
                                    {contact.seen ? "Seen" : "Unseen"}
                                </Badge>
                                {!contact.seen && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-red-100 text-red-800 text-xs"
                                    >
                                        New
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Contact Information */}
                <div className="grid  md:grid-cols-2 gap-6 ">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-700">Name</label>
                                <p className="text-zinc-900 mt-1">{contact.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-700">Email</label>
                                <p className="text-zinc-900 mt-1">{contact.email}</p>
                            </div>
                            {contact.company && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-700">Company</label>
                                    <p className="text-zinc-900 mt-1">{contact.company}</p>
                                </div>
                            )}
                            {contact.number && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-700">Phone Number</label>
                                    <p className="text-zinc-900 mt-1">{contact.number}</p>
                                </div>
                            )}
                            {contact.source && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-700">Source</label>
                                    <p className="text-zinc-900 mt-1">{contact.source}</p>
                                </div>
                            )}
                            {contact.subject && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-700">Subject</label>
                                    <p className="text-zinc-900 mt-1">{contact.subject}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="">
                        {contact.message && (
                            <Card className="">
                                <CardHeader>
                                    <CardTitle className="text-lg">Message</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="prose prose-sm max-w-none text-zinc-900 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: contact.message }}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Message */}

            </div>
        </div>
    );
}