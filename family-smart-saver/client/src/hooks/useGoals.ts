import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { web3Service } from "@/lib/web3";
import { apiRequest } from "@/lib/queryClient";

export interface Goal {
  id: number;
  name: string;
  description?: string;
  targetAmount: string;
  savedAmount: string;
  deadline: Date;
  creatorAddress: string;
  isAchieved: boolean;
  contractGoalId?: number;
  progress: number;
  status: 'active' | 'achieved' | 'expired' | 'near_deadline';
}

export function useGoals(userAddress?: string) {
  const queryClient = useQueryClient();

  const {
    data: goals = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/goals', userAddress],
    enabled: !!userAddress,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: {
      name: string;
      description?: string;
      targetAmount: string;
      deadline: Date;
      creatorAddress: string;
      durationInDays: number;
    }) => {
      // First create on blockchain
      const blockchainResult = await web3Service.createGoal(
        goalData.name,
        goalData.targetAmount,
        goalData.durationInDays
      );

      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error);
      }

      // Then save to database
      const response = await apiRequest('POST', '/api/goals', goalData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
    },
  });

  const contributeMutation = useMutation({
    mutationFn: async (contributionData: {
      goalId: number;
      contractGoalId: number;
      amount: string;
      contributorAddress: string;
    }) => {
      // First contribute on blockchain
      const blockchainResult = await web3Service.contribute(
        contributionData.contractGoalId,
        contributionData.amount
      );

      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error);
      }

      // Then save to database
      const response = await apiRequest('POST', '/api/contributions', {
        goalId: contributionData.goalId,
        contributorAddress: contributionData.contributorAddress,
        amount: contributionData.amount,
        transactionHash: blockchainResult.transactionHash
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contributions'] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (withdrawData: {
      goalId: number;
      contractGoalId: number;
    }) => {
      const blockchainResult = await web3Service.withdraw(withdrawData.contractGoalId);
      
      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error);
      }

      return blockchainResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
    },
  });

  // Calculate statistics
  const stats = {
    totalGoals: goals.length,
    totalSaved: goals.reduce((sum: number, goal: Goal) => sum + parseFloat(goal.savedAmount), 0).toFixed(4),
    completedGoals: goals.filter((goal: Goal) => goal.isAchieved).length,
    nftRewards: goals.filter((goal: Goal) => goal.isAchieved).length
  };

  return {
    goals,
    isLoading,
    error,
    stats,
    refetch,
    createGoal: createGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    contribute: contributeMutation.mutate,
    isContributing: contributeMutation.isPending,
    withdraw: withdrawMutation.mutate,
    isWithdrawing: withdrawMutation.isPending
  };
}

export function useContributions(goalId?: number) {
  return useQuery({
    queryKey: ['/api/contributions', goalId],
    enabled: !!goalId,
  });
}
