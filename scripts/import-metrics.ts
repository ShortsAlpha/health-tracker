
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_SUPABASE_ANON_KEY bulunamadı.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = path.join(process.cwd(), 'metrics.csv');

async function importMetrics() {
    console.log("CSV dosyası aranıyor:", filePath);

    if (!fs.existsSync(filePath)) {
        console.error('❌ metrics.csv bulunamadı!');
        console.log('Lütfen proje ana dizinine (c:\\job\\HealthTracker\\metrics.csv) dosyasını oluşturun.');
        console.log('\nÖrnek Format (Başlık satırı OLMALI):');
        console.log('date,weight,fat,muscle,water');
        console.log('2025-10-24,80.5,20.1,55.4,60.2');
        console.log('2025-10-25,80.2,19.9,55.5,60.1');
        return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const rows = [];

    // Skip index 0 assuming it is header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // CSV: date,weight,fat,muscle,water
        const parts = line.split(',');

        // Simple validation
        if (parts.length < 2) {
            console.warn(`⚠️ Satır atlandı (eksik veri): ${line}`);
            continue;
        }

        const date = parts[0].trim();
        const weight = parseFloat(parts[1]);

        if (!date || isNaN(weight)) {
            console.warn(`⚠️ Satır atlandı (geçersiz tarih/kilo): ${line}`);
            continue;
        }

        rows.push({
            date: date,
            weight: weight,
            fat_rate: parts[2] ? parseFloat(parts[2]) : null,
            muscle_rate: parts[3] ? parseFloat(parts[3]) : null,
            water_rate: parts[4] ? parseFloat(parts[4]) : null
        });
    }

    if (rows.length === 0) {
        console.log("⚠️ Yüklenecek veri bulunamadı.");
        return;
    }

    console.log(`📦 ${rows.length} kayıt okundu. Supabase'e gönderiliyor...`);

    const { error } = await supabase.from('metrics').upsert(rows);

    if (error) {
        console.error('❌ Yükleme Hatası:', error.message);
    } else {
        console.log('✅ Başarıyla yüklendi! Dashboard yenilenince verileri göreceksiniz.');
    }
}

importMetrics();
