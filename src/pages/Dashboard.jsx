import { useState } from "react";
import api from "../api/api";

function Dashboard({ user, setUser, handleLogout, fetchCurrentUser }) {
  const [message, setMessage] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositForm, setShowDepositForm] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const [transferAmount, setTransferAmount] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const handleDeposit = async () => {
    try {
      await api.post("/api/banking/deposit", {
        amount: Number(depositAmount),
      });

      await fetchCurrentUser();
      setDepositAmount("");
      setShowDepositForm(false);
      setMessage("Deposit successful!");
    } catch (error) {
      setMessage("Deposit failed!");
    }
  };

  const handleWithdraw = async () => {
    try {
      await api.post("/api/banking/withdraw", {
        amount: Number(withdrawAmount),
      });

      await fetchCurrentUser();
      setWithdrawAmount("");
      setShowWithdrawForm(false);
      setMessage("Withdraw successful!");
    } catch (error) {
      setMessage("Withdraw failed!");
    }
  };

  const handleTransfer = async () => {
    try {
      await api.post("/api/banking/transfer", {
        receiverUsername,
        amount: Number(transferAmount),
      });

      await fetchCurrentUser();
      setReceiverUsername("");
      setTransferAmount("");
      setShowTransferForm(false);
      setMessage("Transfer successful!");
    } catch (error) {
      setMessage("Transfer failed!");
    }
  };

  const handleTransactions = async () => {
    try {
      const response = await api.get("/api/banking/transactions");

      setTransactions(response.data);
      setShowTransactions(!showTransactions);
      setMessage("");
    } catch (error) {
      setMessage("Transactions could not be loaded!");
    }
  };

  return (
    <div className="container">
      <div className="dashboard-card">
        <h1>SSecureBank Dashboard</h1>
	<p className="welcome">
  Welcome back, <strong>{user.username}</strong>
</p>

        <div className="info-grid">
          <div className="info-box">
            <span>Account Owner</span>
            <strong>{user.username}</strong>
          </div>

          <div className="info-box">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="info-box">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="info-box balance">
            <span>Account Balance</span>
            <strong>{user.balance} ₺</strong>
          </div>
        </div>

        <div className="actions">
          <button onClick={() => setShowDepositForm(!showDepositForm)}>
            Deposit
          </button>

          <button onClick={() => setShowWithdrawForm(!showWithdrawForm)}>
            Withdraw
          </button>

          <button onClick={() => setShowTransferForm(!showTransferForm)}>
            Transfer
          </button>

          <button onClick={handleTransactions}>Transactions</button>
        </div>

        {showDepositForm && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Deposit Money</h2>
      <p>Add money to your SecureBank account.</p>

      <input
        type="number"
        placeholder="Deposit amount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />

      <div className="modal-actions">
        <button className="login-btn" onClick={handleDeposit}>
          Confirm Deposit
        </button>

        <button
          className="cancel-btn"
          onClick={() => {
            setShowDepositForm(false);
            setDepositAmount("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showWithdrawForm && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Withdraw Money</h2>
      <p>Withdraw money from your SecureBank account.</p>

      <input
        type="number"
        placeholder="Withdraw amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />

      <div className="modal-actions">
        <button className="login-btn" onClick={handleWithdraw}>
          Confirm Withdraw
        </button>

        <button
          className="cancel-btn"
          onClick={() => {
            setShowWithdrawForm(false);
            setWithdrawAmount("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showTransferForm && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Transfer Money</h2>
      <p>Send money to another SecureBank user.</p>

      <input
        type="text"
        placeholder="Receiver username"
        value={receiverUsername}
        onChange={(e) => setReceiverUsername(e.target.value)}
      />

      <input
        type="number"
        placeholder="Transfer amount"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      />

      <div className="modal-actions">
        <button className="login-btn" onClick={handleTransfer}>
          Confirm Transfer
        </button>

        <button
          className="cancel-btn"
          onClick={() => {
            setShowTransferForm(false);
            setReceiverUsername("");
            setTransferAmount("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showTransactions && (
  <div className="modal-overlay">
    <div className="modal transactions-modal">
      <h2>Transaction History</h2>
      <p>Your latest SecureBank account activities.</p>

      <div className="transactions">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <strong>{transaction.type}</strong>
              <span>{transaction.amount} ₺</span>
              <p>{transaction.description}</p>
              <small>{transaction.createdAt}</small>
            </div>
          ))
        )}
      </div>

      <button
        className="cancel-btn"
        onClick={() => setShowTransactions(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
        {message && <p className="message">{message}</p>}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
