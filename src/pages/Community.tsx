import { useState, useEffect } from "react";
import { Users, ThumbsUp, MessageCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { formatDistanceToNow } from "date-fns";

interface Post {
  _id: string;
  title: string;
  content: string;
  riskType: string;
  riskLevel: "low" | "medium" | "high";
  author: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  media?: string;
  mediaType?: "image" | "video";
  isAnonymous: boolean;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await postsAPI.like(postId);
      // Update the post in the list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likesCount: result.likesCount }
            : post
        )
      );
      
      // Update liked state
      if (result.liked) {
        setLikedPosts((prev) => new Set(prev).add(postId));
      } else {
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
    setShowCreateDialog(false);
    toast({
      title: "Success",
      description: "Your story has been shared!",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-primary";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Users className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Community <span className="text-primary">Storyboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real Stories, Real Protection
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Login Required",
                    description: "Please login to share your story",
                    variant: "destructive",
                  });
                } else {
                  setShowCreateDialog(true);
                }
              }}
            >
              Share Your Story
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Posts */}
          {!loading && posts.length === 0 && (
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No stories yet. Be the first to share your experience!
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{post.author}</span>
                          <span className="text-sm text-muted-foreground">
                            • {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{post.riskType}</Badge>
                          <Badge
                            className={`${getSeverityColor(post.riskLevel)} text-white`}
                          >
                            {post.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base leading-relaxed">
                      {post.content}
                    </CardDescription>

                    {post.media && (
                      <div className="mt-4">
                        {post.mediaType === "image" ? (
                          <img
                            src={`http://localhost:5000${post.media}`}
                            alt={post.title}
                            className="rounded-lg max-w-full h-auto"
                          />
                        ) : post.mediaType === "video" ? (
                          <video
                            src={`http://localhost:5000${post.media}`}
                            controls
                            className="rounded-lg max-w-full"
                          >
                            Your browser does not support video playback.
                          </video>
                        ) : null}
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-2 border-t border-primary/20">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedPosts.has(post._id)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{post.likesCount}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post.commentsCount}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreatePostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Community;
