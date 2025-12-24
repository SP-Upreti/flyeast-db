import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ShortItineraryViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    itineraryData: any;
}

export function ShortItineraryViewModal({
    isOpen,
    onClose,
    itineraryData,
}: ShortItineraryViewModalProps) {
    if (!itineraryData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Short Day Itinerary Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-sm text-gray-500">Title</h3>
                        <p className="text-base">{itineraryData.title}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-gray-500">Days Description</h3>
                        <p className="text-base whitespace-pre-wrap">{itineraryData.days}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Created At</h3>
                            <p className="text-sm">
                                {new Date(itineraryData.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Updated At</h3>
                            <p className="text-sm">
                                {new Date(itineraryData.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
