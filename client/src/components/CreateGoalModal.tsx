import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goalData: {
    name: string;
    description?: string;
    targetAmount: string;
    deadline: Date;
    creatorAddress: string;
    durationInDays: number;
  }) => void;
  userAddress?: string;
  isCreating?: boolean;
}

export function CreateGoalModal({ 
  isOpen, 
  onClose, 
  onCreateGoal, 
  userAddress,
  isCreating = false 
}: CreateGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAddress) {
      toast({
        title: "خطأ",
        description: "يجب ربط المحفظة أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    const durationInDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (durationInDays <= 0) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون تاريخ الانتهاء في المستقبل",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون المبلغ المطلوب أكبر من صفر",
        variant: "destructive"
      });
      return;
    }

    onCreateGoal({
      name: formData.name,
      description: formData.description || undefined,
      targetAmount: formData.targetAmount,
      deadline: deadlineDate,
      creatorAddress: userAddress,
      durationInDays
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      targetAmount: "",
      deadline: ""
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      targetAmount: "",
      deadline: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 font-arabic">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            إنشاء هدف توفير جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              اسم الهدف *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: سيارة جديدة"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              وصف الهدف
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="اكتب وصفاً مختصراً للهدف..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ المطلوب (ETH) *
            </Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ انتهاء الهدف *
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex space-x-4 space-x-reverse pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary-light text-white"
              disabled={isCreating}
            >
              {isCreating ? "جاري الإنشاء..." : "إنشاء الهدف"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
