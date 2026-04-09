export type UserRole = 'client' | 'worker' | 'admin' | 'agent';
export type AuthType = 'wallet_human' | 'wallet_agent' | 'dev_human';
export type TaskStatus =
	| 'DRAFT'
	| 'OPEN'
	| 'CLAIMED'
	| 'SUBMITTED'
	| 'PENDING_REVIEW'
	| 'APPROVED'
	| 'AUTO_APPROVED'
	| 'REJECTED'
	| 'PAID';

export type UserProfile = {
	id: string;
	username: string;
	role: UserRole;
	walletAddress: string;
	authType: AuthType;
	createdAt: string;
	updatedAt: string;
};

export type SessionUser = Pick<
	UserProfile,
	'id' | 'username' | 'role' | 'walletAddress' | 'authType'
>;

export type AuthSuccess = {
	token: string;
	user: UserProfile;
};

export type WalletChallenge = {
	transactionXdr: string;
	networkPassphrase: string;
	expiresAt: string;
	walletAddress: string;
};

export type TaskRecord = {
	id: string;
	clientId: string;
	workerId: string | null;
	activeSubmissionId: string | null;
	title: string;
	description: string;
	brief: string;
	requiredKeywords: string[];
	targetAudience: string;
	tone: string;
	minWordCount: number;
	payoutAmount: string;
	currencyAsset: string;
	status: TaskStatus;
	reviewWindowHours: number;
	reviewDeadline: string | null;
	allowedClaimantType: 'human' | 'agent' | 'both';
	createdAt: string;
	updatedAt: string;
};

export type SubmissionRecord = {
	id: string;
	taskId: string;
	workerId: string;
	contentText: string;
	notes: string | null;
	documentUrl: string | null;
	submittedAt: string;
	createdAt: string;
};

export type VerificationReport = {
	id: string;
	taskId: string;
	submissionId: string;
	summary: string;
	score: number;
	keywordCoverage: string[];
	missingRequirements: string[];
	toneMatch: boolean;
	audienceFit: boolean;
	recommendation: 'approve' | 'manual_review' | 'reject';
	createdAt: string;
};

export type ReviewDecision = {
	id: string;
	taskId: string;
	reviewerUserId: string;
	decision: 'approve' | 'reject';
	reason: string | null;
	createdAt: string;
	reviewer: {
		id: string;
		username: string;
		role: UserRole;
		stellarWalletAddress: string;
	} | null;
};

export type PayoutRecord = {
	id: string;
	taskId: string;
	amount: string;
	assetCode: string;
	workerWalletAddress: string;
	txHash: string | null;
	status: 'pending' | 'confirmed' | 'failed';
	triggeredBy: 'client' | 'system' | 'agent';
	paidAt: string | null;
	createdAt: string;
};

export type FundingRecord = {
	id: string;
	taskId: string;
	funderUserId: string | null;
	fromWalletAddress: string;
	toWalletAddress: string;
	amount: string;
	assetCode: string;
	txHash: string;
	status: 'pending' | 'confirmed' | 'failed';
	fundedAt: string | null;
	createdAt: string;
};

export type TaskPayoutStatus = {
	taskId: string;
	taskStatus: TaskStatus;
	isPayoutEligible: boolean;
	hasConfirmedFunding: boolean;
	workerWalletAddress: string | null;
	payout: PayoutRecord | null;
};

export type TaskReportSnapshot = {
	task: TaskRecord;
	submission: SubmissionRecord | null;
	verificationReport: VerificationReport | null;
	latestReviewDecision: ReviewDecision | null;
	payoutStatus: TaskPayoutStatus;
};

export type CreateTaskInput = {
	title: string;
	description: string;
	brief: string;
	requiredKeywords: string[];
	targetAudience: string;
	tone: string;
	minWordCount: number;
	payoutAmount: string;
	currencyAsset: 'XLM';
	reviewWindowHours: number;
	allowedClaimantType: 'human' | 'agent' | 'both';
};

export type SubmitTaskInput = {
	contentText: string;
	notes?: string;
	documentUrl?: string;
};

export type FundTaskInput = {
	amount: string;
	assetCode: 'XLM';
	txHash: string;
	fromWalletAddress: string;
	toWalletAddress: string;
};

export type TaskFilters = {
	status?: TaskStatus;
	clientId?: string;
	workerId?: string;
};
