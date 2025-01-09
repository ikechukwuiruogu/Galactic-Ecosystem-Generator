;; Ecosystem Simulation Contract

(define-data-var simulation-count uint u0)

(define-map simulations
  uint
  {
    planet-id: uint,
    species-ids: (list 20 uint),
    start-time: uint,
    duration: uint,
    status: (string-ascii 20),
    result: (string-utf8 1000)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_SIMULATION (err u404))

(define-public (start-simulation (planet-id uint) (species-ids (list 20 uint)) (duration uint))
  (let
    (
      (simulation-id (+ (var-get simulation-count) u1))
    )
    (map-set simulations
      simulation-id
      {
        planet-id: planet-id,
        species-ids: species-ids,
        start-time: block-height,
        duration: duration,
        status: "in-progress",
        result: ""
      }
    )
    (var-set simulation-count simulation-id)
    (ok simulation-id)
  )
)

(define-public (end-simulation (simulation-id uint) (result (string-utf8 1000)))
  (let
    (
      (simulation (unwrap! (map-get? simulations simulation-id) ERR_INVALID_SIMULATION))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set simulations
      simulation-id
      (merge simulation {
        status: "completed",
        result: result
      })
    ))
  )
)

(define-read-only (get-simulation (simulation-id uint))
  (map-get? simulations simulation-id)
)

(define-read-only (get-simulation-count)
  (var-get simulation-count)
)
