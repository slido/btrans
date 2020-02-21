
export class User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    active: boolean;
    loginToken: string;
    passwordResetToken: string;
    emailConfirmed: boolean;
    created_at: string;

    constructor(user?: any) {
        user = user || {};
        this.id = user.id || 0;
        this.email = user.email || '';
        this.first_name = user.first_name || '';
        this.last_name = user.last_name || '';
        this.gender = user.gender || '';
        this.active = user.active || false;
        this.loginToken = user.loginToken || '';
        this.passwordResetToken = user.passwordResetToken || '';
        this.emailConfirmed = user.emailConfirmed || false;
        this.created_at = user.created_at || '';
        //this.role = user.role || '';
        //

    }

}
