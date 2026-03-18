import fs from 'node:fs';
import path from 'node:path';

const reports = [
    {
        label: '@trrack/core',
        file: path.resolve('coverage/core/coverage-summary.json'),
    },
    {
        label: '@trrack/vis-react',
        file: path.resolve('coverage/vis-react/coverage-summary.json'),
    },
];

function formatPercent(value) {
    return `${value.toFixed(2)}%`;
}

function loadReport(report) {
    if (!fs.existsSync(report.file)) {
        return null;
    }

    const summary = JSON.parse(fs.readFileSync(report.file, 'utf8'));
    const files = Object.entries(summary)
        .filter(([key, value]) => key !== 'total' && value.lines.total > 0)
        .map(([key, value]) => ({
            file: path.relative(process.cwd(), key),
            lines: value.lines.pct,
            branches: value.branches.pct,
        }))
        .sort((a, b) => a.lines - b.lines)
        .slice(0, 5);

    return {
        label: report.label,
        total: summary.total,
        files,
    };
}

const loadedReports = reports.map(loadReport).filter(Boolean);

if (loadedReports.length === 0) {
    console.log('## Coverage Summary');
    console.log('');
    console.log('Coverage reports were not found.');
    process.exit(0);
}

console.log('## Coverage Summary');
console.log('');
console.log('| Package | Lines | Statements | Functions | Branches |');
console.log('| --- | ---: | ---: | ---: | ---: |');

for (const report of loadedReports) {
    console.log(
        `| ${report.label} | ${formatPercent(report.total.lines.pct)} | ${formatPercent(report.total.statements.pct)} | ${formatPercent(report.total.functions.pct)} | ${formatPercent(report.total.branches.pct)} |`
    );
}

console.log('');
console.log('### Lowest Line Coverage Files');
console.log('');
console.log('| Package | File | Lines | Branches |');
console.log('| --- | --- | ---: | ---: |');

for (const report of loadedReports) {
    for (const file of report.files) {
        console.log(
            `| ${report.label} | \`${file.file}\` | ${formatPercent(file.lines)} | ${formatPercent(file.branches)} |`
        );
    }
}
