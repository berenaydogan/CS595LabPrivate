use std::merkle::compute_merkle_root;
use std::hash::pedersen_hash;

fn main(
    // Private
    r: Field,
    index: Field,
    path: [Field; 8],

    // Public
    root: pub Field,
    id: pub Field,
) {
    // Recompute commitment
    let commitment = pedersen_hash([id, r]);

    // Prove Merkle inclusion of commitment at index
    let computed_root = compute_merkle_root(commitment, index, path);
    assert(computed_root == root);
}
