'use strict';

export enum GroupMemberStatusType {
    PENDING = 'pending',
    APPROVED = 'approved',
    BANNED = 'banned',
    INVITED = 'invited',
    INVITED_BY_ADMIN = 'invited-by-admin',
}

export enum GroupMemberInvitationStatusType {
    INVITED = GroupMemberStatusType.INVITED,
    INVITED_BY_ADMIN = GroupMemberStatusType.INVITED_BY_ADMIN,
}
