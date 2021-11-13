
;; timelocked-wallet
;; Features:
;; - user can deploy the time-locked wallet contract.
;; - user specifies a beneficiary
;; - user specifies a block height at which the wallet unlocks
;; - anyone can send tokens to the contract.
;; - the beneficiary can claim the tokens when the specified block height is reached
;; - the beneficiary can transfer the right to claim the wallet to a different principal

;; constants
;; 

;; Contract Owner
(define-constant contract-owner tx-sender)

;; Errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-unlock-in-the-past (err u102))
(define-constant err-no-value (err u103))
(define-constant err-beneficiary-only (err u104))
(define-constant err-unlock-height-not-reached (err u105))

;; data maps and vars
;;
(define-data-var beneficiary (optional principal) none)
(define-data-var unlock-height uint u0)


;; private functions
;;

;; public functions
;;

;; lock:
;; - only the contract owner may call lock
;; - wallet cannot be locked twice.
;; - unlock height must be in the future (> current block height)
;; - initial deposit must be > 0 AND deposit must succeed.
(define-public (lock (new-beneficiary principal) (unlock-at uint) (amount uint))
    (begin 
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-none (var-get beneficiary)) err-already-locked)
        (asserts! (> unlock-at block-height) err-unlock-in-the-past)
        (asserts! (> amount u0) err-no-value)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (var-set beneficiary (some new-beneficiary))
        (var-set unlock-height unlock-at)
        (ok true)
    )
)

;; claim:
;; - tx-sender must be the beneficiary to claim
;; - must be past the unlock-height
(define-public (claim)
    (begin 
        (asserts! (is-eq (some tx-sender) (var-get beneficiary)) err-beneficiary-only)
        (asserts! (>= block-height (var-get unlock-height)) err-unlock-height-not-reached)
        (as-contract (stx-transfer? (stx-get-balance tx-sender) tx-sender (unwrap-panic (var-get beneficiary))))
    )
)

;; bestow:
(define-public (bestow (new-beneficiary principal))
    (begin 
        (asserts! (is-eq (some tx-sender) (var-get beneficiary)) err-beneficiary-only)
        (var-set beneficiary (some new-beneficiary))
        (ok true)
    )
)
