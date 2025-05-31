import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Target, TrendingUp, Trophy, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalModal } from "@/components/CreateGoalModal";
import { ContributionModal } from "@/components/ContributionModal";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useWallet } from "@/hooks/useWallet";
import { useGoals, Goal } from "@/hooks/useGoals";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const { isConnected, address } = useWallet();
  const { 
    goals, 
    isLoading, 
    stats, 
    createGoal, 
    isCreating, 
    contribute, 
    isContributing, 
    withdraw, 
    isWithdrawing 
  } = useGoals(address);
  
  const { toast } = useToast();

  const handleCreateGoal = (goalData: any) => {
    createGoal(goalData, {
      onSuccess: () => {
        toast({
          title: "تم إنشاء الهدف",
          description: "تم إنشاء هدف التوفير بنجاح",
        });
        setShowCreateModal(false);
      },
      onError: (error: any) => {
        toast({
          title: "خطأ في إنشاء الهدف",
          description: error.message || "حدث خطأ أثناء إنشاء الهدف",
          variant: "destructive"
        });
      }
    });
  };

  const handleContribute = (contributionData: any) => {
    contribute(contributionData, {
      onSuccess: () => {
        toast({
          title: "تمت المساهمة",
          description: "تمت إضافة مساهمتك بنجاح",
        });
        setShowContributionModal(false);
        setSelectedGoal(null);
      },
      onError: (error: any) => {
        toast({
          title: "خطأ في المساهمة",
          description: error.message || "حدث خطأ أثناء المساهمة",
          variant: "destructive"
        });
      }
    });
  };

  const handleWithdraw = (goal: Goal) => {
    if (!goal.contractGoalId && goal.contractGoalId !== 0) {
      toast({
        title: "خطأ",
        description: "معرف العقد الذكي غير صحيح",
        variant: "destructive"
      });
      return;
    }

    withdraw({
      goalId: goal.id,
      contractGoalId: goal.contractGoalId
    }, {
      onSuccess: () => {
        toast({
          title: "تم سحب الأموال",
          description: "تم سحب الأموال بنجاح",
        });
      },
      onError: (error: any) => {
        toast({
          title: "خطأ في السحب",
          description: error.message || "حدث خطأ أثناء سحب الأموال",
          variant: "destructive"
        });
      }
    });
  };

  const handleContributeClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowContributionModal(true);
  };

  const handleViewDetails = (goal: Goal) => {
    // TODO: Implement goal details view
    toast({
      title: "قريباً",
      description: "ستتوفر صفحة تفاصيل الهدف قريباً",
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-primary rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              مرحباً بك في منصة التوفير الذكي للعائلة
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ربط محفظتك للبدء في إنشاء أهداف التوفير ومشاركتها مع أفراد عائلتك
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الأهداف</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGoals}</p>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المبلغ المُوفر</p>
                  <p className="text-2xl font-bold text-success">{stats.totalSaved} ETH</p>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-lg">
                  <span className="text-success text-xl font-bold">⟠</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الأهداف المُحققة</p>
                  <p className="text-2xl font-bold text-achievement">{stats.completedGoals}</p>
                </div>
                <div className="bg-achievement bg-opacity-10 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-achievement" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">مكافآت NFT</p>
                  <p className="text-2xl font-bold text-warning">{stats.nftRewards}</p>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">أهداف التوفير</h2>
          <div className="flex space-x-3 space-x-reverse">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-light text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء هدف جديد
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </Button>
          </div>
        </div>

        {/* Goals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد أهداف بعد
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              ابدأ بإنشاء أول هدف توفير لعائلتك واحصل على مكافآت NFT عند تحقيقه!
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-light text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء هدف جديد
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {goals.map((goal: Goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onContribute={handleContributeClick}
                onWithdraw={handleWithdraw}
                onViewDetails={handleViewDetails}
                userAddress={address}
              />
            ))}
          </div>
        )}

        {/* Recent Activity Section */}
        <ActivityFeed />

      </main>

      {/* Modals */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGoal={handleCreateGoal}
        userAddress={address}
        isCreating={isCreating}
      />

      <ContributionModal
        isOpen={showContributionModal}
        onClose={() => {
          setShowContributionModal(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onContribute={handleContribute}
        userAddress={address}
        isContributing={isContributing}
      />
    </div>
  );
}
