import { ethers } from "ethers";
import { FAMILY_SAVER_ABI, DEFAULT_CONTRACT_ADDRESS } from "./constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string;

  constructor(contractAddress: string = DEFAULT_CONTRACT_ADDRESS) {
    this.contractAddress = contractAddress;
  }

  async connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
    if (!window.ethereum) {
      return {
        success: false,
        error: "يرجى تثبيت MetaMask للاستمرار"
      };
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      
      // Initialize contract
      this.contract = new ethers.Contract(
        this.contractAddress,
        FAMILY_SAVER_ABI,
        this.signer
      );

      return {
        success: true,
        address
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في الاتصال بالمحفظة"
      };
    }
  }

  async createGoal(name: string, targetEth: string, durationInDays: number): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const targetWei = ethers.utils.parseEther(targetEth);
      const tx = await this.contract.createGoal(name, targetWei, durationInDays);
      await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في إنشاء الهدف"
      };
    }
  }

  async contribute(goalId: number, amountEth: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const amountWei = ethers.utils.parseEther(amountEth);
      const tx = await this.contract.contribute(goalId, { value: amountWei });
      await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في المساهمة"
      };
    }
  }

  async withdraw(goalId: number): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const tx = await this.contract.withdraw(goalId);
      await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في سحب الأموال"
      };
    }
  }

  async getUserGoals(address: string): Promise<{ success: boolean; goalIds?: number[]; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const goalIds = await this.contract.getUserGoals(address);
      return {
        success: true,
        goalIds: goalIds.map((id: ethers.BigNumber) => id.toNumber())
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في جلب الأهداف"
      };
    }
  }

  async getGoal(goalId: number): Promise<{ success: boolean; goal?: any; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const goal = await this.contract.goals(goalId);
      return {
        success: true,
        goal: {
          creator: goal.creator,
          name: goal.name,
          target: ethers.utils.formatEther(goal.target),
          deadline: new Date(goal.deadline.toNumber() * 1000),
          saved: ethers.utils.formatEther(goal.saved),
          isAchieved: goal.isAchieved
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في جلب تفاصيل الهدف"
      };
    }
  }

  async getGoalContributions(goalId: number): Promise<{ success: boolean; contributions?: any[]; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const contributions = await this.contract.getGoalContributions(goalId);
      return {
        success: true,
        contributions: contributions.map((contrib: any) => ({
          contributor: contrib.contributor,
          amount: ethers.utils.formatEther(contrib.amount),
          timestamp: new Date(contrib.timestamp.toNumber() * 1000)
        }))
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "فشل في جلب المساهمات"
      };
    }
  }

  getAddress(): string | null {
    return this.signer ? this.signer.getAddress() as any : null;
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }
}

export const web3Service = new Web3Service();
