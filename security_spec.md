# Security Specification — MikeyFlix Studios

## 1. Data Invariants
1. **Default-Deny Catch-All**: All unspecified Firestore paths are denied by default.
2. **Verified Admin Ownership**: Only the verified studio administrator (`request.auth.token.email_verified == true` and bootstrapped admin email or `/admins/{uid}` entry) can write to `/portfolios/{portfolioId}` or `/clientLinks/{linkId}`.
3. **Public Read Scope**:
   - `/portfolios/{portfolioId}` allows single-document `get` (not `list`) so visitors see the published studio website.
   - `/clientLinks/{linkId}` allows single-document `get` ONLY when `resource.data.active == true` (unlisted token lookup by direct URL); `list` is strictly locked to the verified admin (`resource.data.ownerId == request.auth.uid`) to prevent link scraping.
4. **Immutable Ownership & Server Timestamps**: `ownerId` and `createdAt` cannot be modified after creation; `createdAt == request.time` on create and `updatedAt == request.time` on update.
5. **Strict Schema & Bounds**: Every string, list, and map validates key allowlists (`hasAll` + `hasOnly`), type safety, and size limits (`isValidId` regex on document IDs).

## 2. Adversarial Payloads ("Dirty Dozen")
1. Unauthenticated write to `/portfolios/main` -> `PERMISSION_DENIED`
2. Authenticated non-admin write to `/portfolios/main` -> `PERMISSION_DENIED`
3. Unverified email spoofing admin email on `/portfolios/main` -> `PERMISSION_DENIED`
4. Shadow field (`isAdmin: true`) injected into `/portfolios/main` -> `PERMISSION_DENIED`
5. Oversized `brandName` (> 80 chars) on `/portfolios/main` -> `PERMISSION_DENIED`
6. Forged past `createdAt` timestamp on `/clientLinks/demo` -> `PERMISSION_DENIED`
7. Client attempting `list` query on `/clientLinks` -> `PERMISSION_DENIED`
8. Unauthenticated `get` on inactive `/clientLinks/archived-link` (`active == false`) -> `PERMISSION_DENIED`
9. Admin updating `ownerId` on `/clientLinks/demo` to another UID -> `PERMISSION_DENIED`
10. Invalid document ID (`bad$id!`) on `/clientLinks/bad$id!` -> `PERMISSION_DENIED`
11. Unauthenticated write to `/admins/attacker` -> `PERMISSION_DENIED`
12. `videos` array exceeding 40 items on `/portfolios/main` -> `PERMISSION_DENIED`
