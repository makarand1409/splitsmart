# SplitSmart 💸

> **Problem Statement**
> When groups of friends dine or travel together, payments are often uneven — some pay via cash,
> others via UPI, and sometimes one person pays on behalf of others. This leads to confusion in
> calculating who owes whom and how much. SplitSmart solves this by providing a structured,
> automated solution that tracks expenses, calculates net balances, and generates optimized
> settlement instructions — minimizing the number of transactions needed to settle up.

---

## What It Does

- Create groups for trips, dinners, or any shared expense
- Add expenses with equal or custom splits
- Tag payments as UPI, Cash, or Card
- See live balance per member (who owes what)
- Get optimized "Settle Up" instructions that minimize transactions
- All data persists locally in your browser

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 14 (App Router)           |
| Language       | TypeScript                        |
| UI Components  | shadcn/ui + Radix UI              |
| Styling        | Tailwind CSS v4                   |
| State          | Zustand (with localStorage)       |
| Icons          | Lucide React                      |
| Notifications  | Sonner                            |

---

## How to Clone & Run

### Prerequisites
Make sure you have these installed on your machine:
- [Node.js](https://nodejs.org) (LTS version — the green button)
- Git — [download here](https://git-scm.com/downloads)

Verify they are installed by running:
```bash
node -v
git --version
```

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/makarand1409/splitsmart.git
cd splitsmart
```

---

### Step 2 — Install dependencies

```bash
npm install
```

This installs everything — Next.js, shadcn, Zustand, all of it. Takes about a minute.

---

### Step 3 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 4 — Build for production (optional)

```bash
npm run build
npm start
```

---

## Project Structure

```
splitsmart/
├── app/
│   ├── layout.tsx              # Root layout, fonts, toaster
│   ├── page.tsx                # Home page — groups list
│   ├── not-found.tsx           # 404 page
│   └── groups/
│       └── [id]/
│           └── page.tsx        # Group detail page (tabs)
├── components/
│   ├── ui/                     # shadcn/ui auto-generated components
│   ├── shared/                 # Reusable app components
│   │   ├── MemberAvatar.tsx
│   │   ├── CurrencyDisplay.tsx
│   │   ├── PaymentBadge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GroupBadge.tsx
│   │   └── index.ts
│   ├── groups/                 # Group-related components
│   │   ├── GroupCard.tsx
│   │   ├── CreateGroupModal.tsx
│   │   ├── BalancesTab.tsx
│   │   ├── SettleUpTab.tsx
│   │   └── MembersTab.tsx
│   └── expenses/               # Expense-related components
│       ├── ExpensesList.tsx
│       └── AddExpenseModal.tsx
├── store/
│   └── index.ts                # Zustand store (all app state)
├── lib/
│   └── utils.ts                # Balance calc, settlement algorithm, helpers
├── types/
│   └── index.ts                # TypeScript types
└── README.md
```

---

## Core Algorithm

The settlement algorithm works in two steps:

**Step 1 — Calculate net balance per member:**
```
balance = total paid by member − their share across all expenses
positive = they are owed money
negative = they owe money
```

**Step 2 — Minimize transactions (greedy matching):**
```
Sort creditors (positive balance) descending
Sort debtors (negative balance) descending
Match largest debtor → largest creditor
Repeat until all balances are zero
```

This guarantees the minimum number of transactions to fully settle the group.

---

## Roadmap / Future Enhancements

These features are planned but not yet built:

- [ ] **Firebase Auth** — Google login so each user has their own account
- [ ] **Firestore Sync** — Real-time data sync across devices and friends
- [ ] **Share Group Link** — Invite friends to join a group via a link
- [ ] **UPI Deep Links** — pay directly via UPI in Settle Up tab
- [ ] **Payment Reminders** — Notify members who haven't settled
- [ ] **WhatsApp Share** — Share settlement summary as a message
- [ ] **Expense Categories** — Food, Travel, Accommodation, etc.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "add: my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ to split bills, not friendships.*
