import { ethers, BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { FAMILY_SAVER_ABI, DEFAULT_CONTRACT_ADDRESS, NETWORKS } from "./constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: Contract | null = null;
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
      this.provider = new BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      
      // Check and switch to Web5Layer network
      const switchResult = await this.switchToWeb5Layer();
      if (!switchResult.success) {
        console.warn("Could not switch to Web5Layer network:", switchResult.error);
      }
      
      // Initialize contract
      this.contract = new Contract(
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

  async switchToWeb5Layer(): Promise<{ success: boolean; error?: string }> {
    if (!window.ethereum) {
      return { success: false, error: "MetaMask not available" };
    }

    try {
      const web5LayerConfig = NETWORKS.web5layer;
      
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${web5LayerConfig.chainId.toString(16)}` }],
      });
      
      return { success: true };
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        try {
          const web5LayerConfig = NETWORKS.web5layer;
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${web5LayerConfig.chainId.toString(16)}`,
              chainName: web5LayerConfig.name,
              rpcUrls: [web5LayerConfig.rpcUrl],
              blockExplorerUrls: web5LayerConfig.blockExplorer ? [web5LayerConfig.blockExplorer] : null,
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            }],
          });
          return { success: true };
        } catch (addError: any) {
          return { success: false, error: addError.message };
        }
      }
      return { success: false, error: error.message };
    }
  }

  async getCurrentNetwork(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }
    
    const network = await this.provider.getNetwork();
    const chainId = Number(network.chainId);
    const networkConfig = Object.values(NETWORKS).find(n => n.chainId === chainId);
    
    return {
      chainId,
      name: networkConfig?.name || `Unknown (${chainId})`
    };
  }

  async createGoal(name: string, targetEth: string, durationInDays: number): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    if (!this.contract) {
      return { success: false, error: "لم يتم الاتصال بالعقد الذكي" };
    }

    try {
      const targetWei = parseEther(targetEth);
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
      const amountWei = parseEther(amountEth);
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
        goalIds: goalIds.map((id: bigint) => Number(id))
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
          target: formatEther(goal.target),
          deadline: new Date(Number(goal.deadline) * 1000),
          saved: formatEther(goal.saved),
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
          amount: formatEther(contrib.amount),
          timestamp: new Date(Number(contrib.timestamp) * 1000)
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
