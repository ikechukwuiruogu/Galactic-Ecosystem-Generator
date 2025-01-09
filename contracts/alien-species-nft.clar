;; Alien Species NFT Contract

(define-non-fungible-token alien-species-nft uint)

(define-data-var last-token-id uint u0)

(define-map token-metadata
  uint
  {
    name: (string-ascii 100),
    description: (string-utf8 1000),
    creator: principal,
    species-id: uint,
    rarity-score: uint,
    image-url: (string-ascii 256)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))

(define-public (mint (name (string-ascii 100)) (description (string-utf8 1000)) (species-id uint) (rarity-score uint) (image-url (string-ascii 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (try! (nft-mint? alien-species-nft token-id tx-sender))
    (map-set token-metadata
      token-id
      {
        name: name,
        description: description,
        creator: tx-sender,
        species-id: species-id,
        rarity-score: rarity-score,
        image-url: image-url
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-public (transfer (token-id uint) (recipient principal))
  (nft-transfer? alien-species-nft token-id tx-sender recipient)
)

(define-read-only (get-token-metadata (token-id uint))
  (map-get? token-metadata token-id)
)

(define-read-only (get-last-token-id)
  (var-get last-token-id)
)

