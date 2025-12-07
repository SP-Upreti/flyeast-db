import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, User, Clock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fetchLoginStats } from "@/services/trackLoign";

interface LoginData {
    total: number;
    success: number;
    failed: number;
    last30Days: Array<{
        date: string;
        success: number;
        failed: number;
    }>;
    recent: Array<{
        _id: string;
        email: string;
        status: "success" | "failed";
        timestamp: string;
        userAgent: string;
        ip: string;
    }>;
}

function LoginNotification() {
    const [loginData, setLoginData] = useState<LoginData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getBrowserInfo = (userAgent: string) => {
        if (userAgent.includes("Chrome")) return "Chrome";
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Safari")) return "Safari";
        if (userAgent.includes("Edge")) return "Edge";
        return "Unknown";
    };

    const fetchLogin = async () => {
        try {
            setLoading(true);
            const response = await fetchLoginStats();
            if (response?.data?.data) {
                setLoginData(response.data.data);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Error fetching login stats:", error);
            setError(error.message || "Failed to fetch login statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogin();

        // Refresh data every 5 minutes
        const interval = setInterval(fetchLogin, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate recent failed attempts for notification badge
    const recentFailedCount = loginData?.recent?.filter(
        (login) => login.status === "failed" &&
            new Date(login.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
    ).length || 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full bg-zinc-50 hover:bg-zinc-50 cursor-pointer border hover:border-red-500"
                >
                    <Shield className="h-5 w-5 text-zinc-400" />

                    {recentFailedCount > 0 && (
                        <Badge className="absolute animate-pulse -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs text-white bg-red-500 hover:bg-red-600">
                            {recentFailedCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-96" align="end">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        Login Activity
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Recent authentication attempts</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                    </div>
                ) : error || !loginData ? (
                    <div className="p-4 text-center text-sm text-red-500">
                        Failed to load login data
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="p-4 border-b bg-gray-50/50">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">Total</span>
                                    <span className="text-lg font-bold text-gray-800">{loginData.total}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">Success</span>
                                    <span className="text-lg font-bold text-green-600">{loginData.success}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">Failed</span>
                                    <span className="text-lg font-bold text-red-600">{loginData.failed}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <ScrollArea className="h-64">
                            <div className="p-2">
                                {loginData.recent && loginData.recent.length > 0 ? (
                                    <div className="space-y-2">
                                        {loginData.recent.slice(0, 8).map((login) => (
                                            <DropdownMenuItem
                                                key={login._id}
                                                className={`flex items-start gap-3 p-3 rounded-sm cursor-pointer transition-colors ${login.status === "failed"
                                                    ? "hover:bg-red-50 border-l-2 border-l-red-200"
                                                    : "hover:bg-green-50 border-l-2 border-l-green-200"
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {login.status === "success" ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {login.email}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {getBrowserInfo(login.userAgent)} • {login.ip}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-red-500 whitespace-nowrap ml-2">
                                                            {formatDistanceToNow(parseISO(login.timestamp), {
                                                                addSuffix: true,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                                        <Clock className="h-6 w-6 mb-2" />
                                        <p className="text-sm">No recent login activity</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <DropdownMenuSeparator />

                        {/* View All Link */}
                        <DropdownMenuItem className="p-3 text-center cursor-pointer hover:bg-red-50">
                            <div className="text-sm font-medium text-red-600">
                                View Full Activity Report
                            </div>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LoginNotification;
