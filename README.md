# Krishna Building Material

A responsive business website using Next.js App Router, TypeScript, Tailwind CSS, Firebase Authentication, Cloud Firestore, and Firebase Storage.

## Included
- Home page with industrial charcoal / concrete / orange visual theme
- Feedback & Enquiry page with Firebase-backed submissions
- Welcome page at `/welcome` with customer registration form
- Location page with map link/embed placeholder
- Social profile and review links in one config file
- Firebase Authentication for staff sign-in with server-managed session cookies
- Firestore-backed feedback, enquiries, customer registrations, and staff dashboard counts
- Firebase Storage setup with access denied by default until an upload workflow is added
- Supabase-to-Firebase migration script for existing records and staff roles

## Run locally
1. Install Node.js 20.9+.
2. Create a Firebase project. Enable Email/Password in Authentication and create the Firestore database and Storage bucket.
3. Add staff accounts in Firebase Authentication. In Firestore, create a `staffRoles/{lowercase-email}` document for each staff account with fields such as `{ "email": "staff@example.com", "full_name": "Staff Name", "role": "staff" }`. Use `admin` for administrators.
4. In Firebase Console, create a service-account key for server-side access. You can place the downloaded JSON file in the project root as `serviceaccount.json`; this filename is ignored by Git. Alternatively, keep the file outside the project and set `GOOGLE_APPLICATION_CREDENTIALS` to its absolute path in `.env.local`. You can also set `FIREBASE_SERVICE_ACCOUNT_JSON` to the complete service-account JSON on one line. Set only one of these credential options. Copy the Firebase web app's API key, auth domain, project ID, and app ID into the corresponding `NEXT_PUBLIC_FIREBASE_*` variables.
5. Copy `.env.example` to `.env.local` and fill in the values. Never put a service-account key in a `NEXT_PUBLIC_*` variable or commit it. The Firebase web app config is separate from the private Admin SDK credentials.
6. Deploy the restrictive Firestore and Storage rules with the Firebase CLI:

   ```bash
   npx firebase-tools deploy --only firestore:rules,storage --project YOUR_FIREBASE_PROJECT_ID
   ```

7. Install and run:

   ```bash
   npm install
   npm run dev
   ```

8. Open http://localhost:3000.

Customer registration submissions are written to the Firestore `customer_registrations` collection with `phone`, `customer_type`, and `created_at` fields. Feedback and enquiries are stored in the `feedback` and `enquiries` collections. To inspect records, open Firebase Console → your project → **Firestore Database** → **Data**, then select the collection.

## Migrate from Supabase

The migration is an explicit, repeatable copy; it does not delete or alter the Supabase source records. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, ensure the Firebase Admin service account has Firestore access, and run:

```bash
npm run migrate:firebase
```

The script copies `feedback`, `enquiries`, `customer_registrations`, `testimonials`, and `business_settings` using their existing IDs. It maps Supabase staff profiles to `staffRoles` by email. Supabase password hashes cannot be moved; create/reset staff accounts in Firebase Authentication using the same email addresses before they sign in.

## Before publishing
Replace the placeholder business details and social URLs in `src/config/business.ts`.
Verify the Google Maps location URL and map embed URL in `src/config/business.ts`.
Review Firestore/Storage rules before adding client-side access or a file-upload workflow. Current app data access is server-only; Firebase Admin SDK requests bypass Firestore rules.
Public feedback, enquiry, and customer registration routes currently write data through server-side Firebase Admin.

## Important implementation notes
- Staff access requires a Firebase-authenticated user and a matching `staffRoles/{lowercase-email}` record with role `admin` or `staff`.
- Never expose Firebase service-account credentials or Supabase migration service-role credentials in browser code.
- External platform ratings/reviews are not fetched automatically. Buttons redirect to the real platform review pages.
- Instagram profile links are included; automatic Instagram feed display requires a separate approved integration.
- The location map is a placeholder until the verified shop address and map embed URL are supplied.
