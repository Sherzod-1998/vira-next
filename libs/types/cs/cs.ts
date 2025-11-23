export interface CsInquiry {
	_id: string;
	title: string;
	content: string;
	answer: string | null;
	status: string;
	userId: string;
	createdAt: string;
}