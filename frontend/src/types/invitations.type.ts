export type InvitationType = {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    owner: string,
    organization: string,
    organization_id: number;
    requestInvitation: (id: number, choice: boolean) => void;
}