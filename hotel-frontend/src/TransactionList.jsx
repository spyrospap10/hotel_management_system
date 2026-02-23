import React, { useState, useEffect } from 'react';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error(err));
    }, []);

    // Διαχωρισμός Εσόδων και Εξόδων
    const incomes = transactions.filter(t => t.type === 'INCOME');
    const expenses = transactions.filter(t => t.type === 'EXPENSE');

    // Υπολογισμός Συνόλων
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpense;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Οικονομικός Έλεγχος</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>

                {/* ΠΙΝΑΚΑΣ 1: ΕΣΟΔΑ */}
                <div style={{ flex: 1, backgroundColor: '#f4fbf4', padding: '15px', borderRadius: '8px', border: '1px solid #d4edda' }}>
                    <h3 style={{ color: '#28a745', textAlign: 'center', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>🟢 ΕΣΟΔΑ</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                        {incomes.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{t.category}</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>+{t.amount}€</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <h3 style={{ textAlign: 'right', marginTop: '15px' }}>Σύνολο: <span style={{ color: '#28a745' }}>{totalIncome}€</span></h3>
                </div>

                {/* ΠΙΝΑΚΑΣ 2: ΕΞΟΔΑ */}
                <div style={{ flex: 1, backgroundColor: '#fff5f5', padding: '15px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
                    <h3 style={{ color: '#dc3545', textAlign: 'center', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>🔴 ΕΞΟΔΑ</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                        {expenses.length === 0 && <tr><td style={{ padding: '8px', textAlign: 'center', color: '#888' }}>Κανένα έξοδο ακόμα</td></tr>}
                        {expenses.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{t.category}</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>-{t.amount}€</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <h3 style={{ textAlign: 'right', marginTop: '15px' }}>Σύνολο: <span style={{ color: '#dc3545' }}>{totalExpense}€</span></h3>
                </div>

            </div>

            {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
            <div style={{ marginTop: '30px', textAlign: 'center', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px', fontSize: '1.2em' }}>
                <strong>Καθαρό Κέρδος: </strong>
                <span style={{ color: netProfit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold', fontSize: '1.3em' }}>
                    {netProfit}€
                </span>
            </div>
        </div>
    );
}

export default TransactionList;