const contractAddress = '0x52aF46E304FB35F960e27b314AAe9572D6100f22';
let provider, signer, contract;

async function initApp() {
  const detectedProvider = await detectEthereumProvider();
  if (detectedProvider) {
    startApp(detectedProvider);
  } else {
    console.log('Please install MetaMask!');
  }
}

function startApp(ethProvider) {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log(contract);

    contract.currentRoot().then(root => {
      document.getElementById('root').innerText = root;
    });

    contract.on("Deposit", (newRoot, commitment, index) => {
      const li = document.createElement('li');
      li.textContent = `New Root: ${newRoot}, Commitment: ${commitment}, Index: ${index}`;
      document.getElementById('events').appendChild(li);
      document.getElementById('root').innerText = newRoot;
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

async function deposit() {
  const proof = document.getElementById("proofDeposit").value;
  const newRoot = document.getElementById("newRoot").value;
  const commitment = document.getElementById("commitment").value;

  try {
    const tx = await contract.deposit(proof, newRoot, commitment, {
      value: ethers.utils.parseEther("0.1")
    });
    await tx.wait();
    alert("Deposit successful!");
  } catch (error) {
    console.error("Deposit failed:", error);
  }
}

async function withdraw() {
  const proof = document.getElementById("proofWithdraw").value;
  const nullifier = document.getElementById("nullifier").value;

  try {
    const tx = await contract.withdraw(proof, nullifier);
    await tx.wait();
    alert("Withdraw successful!");
  } catch (error) {
    console.error("Withdraw failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
