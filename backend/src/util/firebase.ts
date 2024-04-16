import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  App,
  ServiceAccount,
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseServiceAccount from '../firebaseServiceAccount.json';

@Injectable()
export class FirebaseApp {
  private firebaseApp: App;

  constructor() {
    try {
      const currentApps = getApps();
      this.firebaseApp =
        currentApps.length === 0
          ? initializeApp({
              credential: cert(firebaseServiceAccount as ServiceAccount),
            })
          : currentApps[0];
    } catch (err) {
      console.error('Error initializing firebase:', err);
      throw err;
    }
  }

  private getFirebaseAuth() {
    return getAuth(this.firebaseApp);
  }

  async createCustomToken(uid: string) {
    try {
      const auth = this.getFirebaseAuth();
      return auth.createCustomToken(uid);
    } catch (err) {
      console.error('Firebase create custom token error:', err);
      throw err;
    }
  }

  /**
   * Note that idToken here should be one from getIdToken() function when user have logged in
   * via signInWithCustomToken() function call
   *
   * ref: https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
   *
   * @param idToken firebase client session token
   * @returns DecodedIdToken
   */
  async verifyIdToken(idToken: string) {
    try {
      const auth = this.getFirebaseAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (err) {
      console.error('Firebase verify id token error:', err);
      throw err;
    }
  }
}
