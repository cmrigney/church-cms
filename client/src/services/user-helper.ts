import { User } from "../models/user";
import axios from 'axios';

interface UserResponse {
    valid: boolean;
    user: User;
}

export async function getUser() : Promise<User|null> {
    let user = await axios.get('/api/admin/user');
    if(user.data.valid)
        return user.data.user as User;
    return null;
}

export async function logout() : Promise<void> {
    await axios.post('/admin/logout');
}