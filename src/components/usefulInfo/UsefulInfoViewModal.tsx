import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Info, Calendar } from "lucide-react";
import type { usefulInfo } from "@/types/usefulinfo";

interface UsefulInfoViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    infoData: usefulInfo | null;
}

export function UsefulInfoViewModal({
    isOpen,
    onClose,
    infoData,
}: UsefulInfoViewModalProps) {
    if (!infoData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Info className="h-6 w-6" />
                        {infoData.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Main Content */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: infoData.description }}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="bg-muted/50 p-4 rounded-sm">
                        <h3 className="text-lg font-semibold mb-3">Information Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">Created:</span>{" "}
                                    {format(new Date(infoData.createdAt), "PPP")}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">Updated:</span>{" "}
                                    {format(new Date(infoData.updatedAt), "PPP")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}