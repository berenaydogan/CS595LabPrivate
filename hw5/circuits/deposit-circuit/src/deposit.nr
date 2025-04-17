use std::merkle::compute_merkle_root;
use std::hash::pedersen_hash;

fn main(
    // Private inputs
    id: Field,
    r: Field,
    oldPath: [Field; 8],

    // Public inputs
    oldRoot: pub Field,
    newRoot: pub Field,
    commitment: pub Field,
    index: pub Field,
) {
    // Recompute commitment
    let computed_commitment = pedersen_hash([id, r]);
    assert(computed_commitment == commitment);

    // Verify oldRoot corresponds to oldPath at the given index
    let old_computed_root = compute_merkle_root(0x18d85f3de6dcd78b6ffbf5d8374433a5528d8e3bf2100df0b7bb43a4c59ebd63, index, oldPath);
    assert(old_computed_root == oldRoot);

    // Compute new root after inserting commitment at index
    let updated_root = compute_merkle_root(commitment, index, oldPath);
    assert(updated_root == newRoot);
}
