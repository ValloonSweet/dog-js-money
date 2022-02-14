use anchor_lang::prelude::*;

declare_id!("CTGuejt4r7fPuQpRFu5qtxMguHScjkEqcgLs1FtwPP51");

#[program]
mod mysolanaapp {
    use super::*;

    /*
     these two functions are the RPC request handlers that we will be able 
     to call from a client app to interact with the program.
     */
    pub fn create(ctx: Context<Create>) -> ProgramResult {
        // getting data from Data Account
        let base_account = &mut ctx.accounts.base_account;
        
        // manipulating data - Business Logic
        base_account.count = 0;
        
        // Return
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 16 + 16)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub count: u64,
}