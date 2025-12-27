import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Comments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Star } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CommentsManagementTableProps {
  comments: Comments[];
  onCommentDeleted: () => void;
}

export default function CommentsManagementTable({
  comments,
  onCommentDeleted,
}: CommentsManagementTableProps) {
  const [commentToDelete, setCommentToDelete] = useState<Comments | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setIsLoading(true);
      await BaseCrudService.delete('commenti', commentToDelete._id);
      setCommentToDelete(null);
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (comments.length === 0) {
    return (
      <Card className="p-8 bg-primary/50 border-secondary/20 text-center">
        <p className="text-secondary font-paragraph">
          Nessun commento ancora. I visitatori potranno lasciare commenti sulle pagine dei libri.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card
          key={comment._id}
          className="p-4 bg-primary/50 border-secondary/20 hover:border-secondary/40 transition"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-heading font-bold text-foreground">
                  {comment.visitorName || 'Anonimo'}
                </h4>
                {comment.rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: comment.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                )}
              </div>

              {comment.visitorEmail && (
                <p className="text-sm text-secondary font-paragraph mb-2">
                  {comment.visitorEmail}
                </p>
              )}

              <p className="text-foreground font-paragraph mb-2">
                {comment.commentText}
              </p>

              {comment.commentDate && (
                <p className="text-xs text-secondary font-paragraph">
                  {format(new Date(comment.commentDate), 'dd MMMM yyyy HH:mm', {
                    locale: it,
                  })}
                </p>
              )}
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCommentToDelete(comment)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      {commentToDelete && (
        <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
          <AlertDialogContent className="bg-white">
            <AlertDialogTitle className="font-heading font-bold text-brand-color">
              Elimina Commento
            </AlertDialogTitle>
            <AlertDialogDescription className="font-paragraph text-foreground">
              Sei sicuro di voler eliminare il commento di{' '}
              {commentToDelete.visitorName || 'questo visitatore'}? Questa azione non può
              essere annullata.
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteComment}
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {isLoading ? 'Eliminazione...' : 'Elimina'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
