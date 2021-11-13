;; counter
;; Counter example from book.clarity-lang.org

;; constants
;;

;; data maps and vars
;;
(define-map counters principal uint)

;; private functions
;;
(define-read-only (get-count (who principal))
    (default-to u0 (map-get? counters who))
)

;; public functions
;;

;; Multi-Player Counter contract
(define-public (count-up)
    (ok (map-set counters tx-sender (+ (get-count tx-sender) u1)))
)
