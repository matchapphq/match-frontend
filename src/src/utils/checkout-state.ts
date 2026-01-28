/**
 * Checkout State Manager
 * 
 * Manages state persistence for Stripe checkout flow.
 * Saves context before redirecting to Stripe and restores it after return.
 */

export interface CheckoutState {
  type: 'onboarding' | 'add-venue';
  venueId?: string;
  venueName?: string;
  formule: 'mensuel' | 'annuel';
  sessionId?: string;
  checkoutUrl?: string;
  returnPage?: string;
  createdAt: number;
}

const CHECKOUT_STATE_KEY = 'match_pending_checkout';
const CHECKOUT_STATE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Save checkout state before redirecting to Stripe
 */
export function saveCheckoutState(state: Omit<CheckoutState, 'createdAt'>): void {
  const stateWithTimestamp: CheckoutState = {
    ...state,
    createdAt: Date.now(),
  };
  localStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(stateWithTimestamp));
}

/**
 * Get pending checkout state (if any and not expired)
 */
export function getCheckoutState(): CheckoutState | null {
  try {
    const stored = localStorage.getItem(CHECKOUT_STATE_KEY);
    if (!stored) return null;
    
    const state: CheckoutState = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() - state.createdAt > CHECKOUT_STATE_TTL) {
      clearCheckoutState();
      return null;
    }
    
    return state;
  } catch {
    clearCheckoutState();
    return null;
  }
}

/**
 * Clear checkout state
 */
export function clearCheckoutState(): void {
  localStorage.removeItem(CHECKOUT_STATE_KEY);
}

/**
 * Check if we're returning from Stripe checkout
 */
export function isReturningFromStripe(): { success: boolean; sessionId: string | null; canceled: boolean } {
  const params = new URLSearchParams(window.location.search);
  const checkoutStatus = params.get('checkout');
  const sessionId = params.get('session_id');
  
  return {
    success: checkoutStatus === 'success' && !!sessionId,
    sessionId: sessionId,
    canceled: checkoutStatus === 'canceled',
  };
}

/**
 * Clean URL after processing checkout return
 */
export function cleanCheckoutUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('checkout');
  url.searchParams.delete('session_id');
  window.history.replaceState({}, document.title, url.pathname);
}

/**
 * App State Manager
 * Manages current page state for session persistence
 */
const APP_STATE_KEY = 'match_app_state';

export interface AppState {
  currentPage: string;
  selectedRestaurantId?: number;
  selectedMatchId?: number;
  selectedFormule?: 'mensuel' | 'annuel';
  nomBarOnboarding?: string;
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

export function getAppState(): AppState | null {
  try {
    const stored = localStorage.getItem(APP_STATE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAppState(): void {
  localStorage.removeItem(APP_STATE_KEY);
}
