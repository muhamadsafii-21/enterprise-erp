<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Laba Rugi</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333;
        }

        h2 {
            text-align: center;
            margin-bottom: 5px;
        }

        .periode {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f4f4f4;
        }

        .text-right {
            text-align: right;
        }
    </style>
</head>

<body>
    <h2>Laporan Laba Rugi (Profit & Loss)</h2>
    <div class="periode">Periode: {{ $startDate }} s/d {{ $endDate }}</div>

    <table>
        <thead>
            <tr>
                <th>Keterangan</th>
                <th class="text-right">Jumlah (Rp)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1. Total Pendapatan (Revenue)</td>
                <td class="text-right">{{ number_format($totalRevenue, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>2. Harga Pokok Penjualan / Pembelian (HPP / COGS)</td>
                <td class="text-right">{{ number_format($totalCogs, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>LABA KOTOR (Gross Profit)</strong></td>
                <td class="text-right"><strong>{{ number_format($grossProfit, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td>3. Total Beban Operasional</td>
                <td class="text-right">{{ number_format($totalExpense, 0, ',', '.') }}</td>
            </tr>
            <tr style="background-color: #e6ffed;">
                <td><strong>LABA / RUGI BERSIH (NET PROFIT)</strong></td>
                <td class="text-right"><strong>{{ number_format($netProfit, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>
</body>

</html>
