import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Home,
} from "lucide-react";
import type { Member } from "@/types/team-member";

interface MemberViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: Member | null;
}

export function MemberViewModal({
  isOpen,
  onClose,
  memberData,
}: MemberViewModalProps) {
  if (!memberData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:top-2 [&>button]:right-2 [&>button]:z-10">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {memberData.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className={
                  memberData.memberType === "boardmember"
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-500"
                }
              >
                {memberData.memberType === "boardmember"
                  ? "Board Member"
                  : "Field Hero"}
              </Badge>
              {memberData.addToHome && (
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-500 flex gap-2 items-center"
                >
                  <Home className="size-4 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image */}
          {memberData.image && (
            <div className="flex justify-center">
              <div className="relative rounded-sm overflow-hidden h-48 w-48">
                <img
                  src={memberData.image}
                  alt={memberData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: memberData.description }}
                />
              </div>

              {/* CV Image */}
              {memberData.cvImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">CV</h3>
                  <div className="border rounded-sm overflow-hidden">
                    <img
                      src={memberData.cvImage}
                      alt="CV"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Gallery */}
              {memberData.gallery && memberData.gallery.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {memberData.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-sm overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with Key Information */}
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-sm space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Designation:</span>{" "}
                      {memberData.designation}
                    </span>
                  </div>

                  {memberData.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {memberData.countryCode} {memberData.phoneNumber}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Joined:</span>{" "}
                      {format(new Date(memberData.createdAt), "PPP")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {(memberData.facebook ||
                memberData.linkedin ||
                memberData.instagram) && (
                  <div className="bg-muted/50 p-4 rounded-sm space-y-4">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <Separator />

                    <div className="space-y-3">
                      {memberData.facebook && (
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <a
                            href={memberData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Facebook
                          </a>
                        </div>
                      )}



                      {memberData.linkedin && (
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          <a
                            href={memberData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-700 hover:underline"
                          >
                            LinkedIn
                          </a>
                        </div>
                      )}

                      {memberData.instagram && (
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          <a
                            href={memberData.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-pink-600 hover:underline"
                          >
                            Instagram
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
