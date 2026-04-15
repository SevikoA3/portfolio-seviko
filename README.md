# Portfolio Website

Project ini adalah website portfolio personal yang dipakai untuk menampilkan profil singkat, pengalaman, proyek, publikasi, dan informasi kontak dalam satu antarmuka yang konsisten. Fungsinya bukan hanya sebagai halaman perkenalan, tetapi juga sebagai tempat untuk merangkum hasil kerja dan riwayat aktivitas yang tersebar di beberapa area.

Isi website disusun agar mudah diperbarui dan tidak bergantung pada konten yang ditulis langsung di komponen antarmuka. Karena itu, proyek ini memisahkan tampilan dan sumber data supaya perubahan pada project, experience, atau publication bisa dilakukan dengan lebih rapi tanpa harus banyak mengubah struktur halaman.

Secara umum, website ini dibuat sebagai portfolio yang ringkas di permukaan tetapi tetap cukup lengkap saat ditelusuri lebih jauh. Setiap section memiliki fungsi yang jelas, mulai dari memberi gambaran awal, menunjukkan bidang yang dikerjakan, menampilkan daftar karya, sampai menyediakan jalur kontak.

## Gambaran Isi Website

Halaman utama dirancang sebagai ringkasan dari seluruh isi portfolio. Pengunjung pertama kali melihat hero section yang memperkenalkan peran utama dan arah bidang yang ditekuni. Setelah itu, alur konten bergerak ke area kompetensi inti, publikasi terbaru, pengalaman terbaru, proyek unggulan, ringkasan tentang diri, dan ajakan untuk menghubungi.

Struktur halaman ini dibuat bertahap supaya pengunjung bisa memahami isi website dari ringkasan ke detail. Bagian awal memberi konteks umum, lalu halaman-halaman berikutnya menyediakan informasi yang lebih spesifik melalui pengalaman, project, dan publication. Pendekatan ini memudahkan pembaca yang hanya ingin melihat highlight singkat maupun yang ingin membaca lebih lengkap.

Selain homepage, website ini juga memiliki halaman khusus untuk beberapa area penting:

- `Projects` menampilkan proyek-proyek utama yang diprioritaskan sebagai karya unggulan, lengkap dengan cover visual, deskripsi, kategori, tag teknologi, serta tautan demo atau source code jika tersedia.
- `More Projects` melengkapi halaman project utama dengan daftar karya tambahan yang tetap relevan, tetapi disajikan dalam format yang lebih ringkas agar fokus utama tetap terjaga.
- `Experience` menyusun rekam jejak organisasi, akademik, laboratorium, komunitas, hingga peran profesional ke dalam format yang lebih mudah dibaca sebagai perjalanan perkembangan.
- `Publications` menjadi ruang untuk menampilkan karya tulis atau paper yang memperkuat sisi akademik dan riset.
- `About` berfungsi sebagai ruang naratif untuk menjelaskan pendekatan berpikir, nilai kerja, dan positioning personal di persimpangan data, AI, dan software engineering.
- `Contacts` menjadi endpoint yang secara jelas mengarahkan pengunjung untuk membangun koneksi lebih lanjut.

## Karakter Visual dan Pengalaman Pengguna

Secara visual, proyek ini memakai antarmuka yang tegas, bersih, dan sedikit teknikal. Typography berukuran besar, headline yang menonjol, label bergaya sistem, serta kombinasi grid dan kartu dipakai untuk membantu membedakan hirarki informasi. Gaya ini dipilih agar isi portfolio lebih mudah dipindai dan tidak terasa datar.

Interaksi pada halaman dibuat cukup aktif tetapi tetap terkendali. Efek boot screen saat aplikasi pertama kali dimuat memberi pembukaan yang khas, sementara animasi scroll-reveal membantu elemen masuk secara bertahap ketika pengguna menelusuri halaman. Pemakaian animasi tidak diarahkan untuk sekadar dekorasi, tetapi untuk membangun ritme baca dan memperjelas hierarki konten. Project card, experience card, dan publication highlight semuanya dirancang agar mudah dipindai tanpa kehilangan identitas visual yang konsisten.

Penyusunan layout juga memperhatikan kenyamanan dalam membaca konten yang cukup padat. Section dibagi dengan latar yang bergantian, jarak antarelemen dibuat longgar, dan konten penting diberi pembeda visual yang jelas melalui badge, tag, label kategori, serta treatment pada tombol dan tautan. Hasilnya adalah pengalaman membaca yang tetap ringan walaupun informasi yang ditampilkan cukup banyak.

## Arsitektur Konten dan Data

Salah satu bagian penting dari proyek ini adalah pemisahan antara presentasi dan sumber data. Konten portfolio tidak sepenuhnya ditulis langsung di komponen React, melainkan diorganisasi melalui koleksi data yang kemudian diambil dari Firebase Firestore. Dengan cara ini, website lebih mudah dipelihara ketika isi portfolio bertambah atau berubah.

Data utama dibagi ke beberapa domain konten:

- `projects` untuk karya unggulan yang tampil di homepage dan halaman project utama.
- `moreProjects` untuk proyek tambahan yang tetap penting, tetapi tidak perlu berada di lapisan presentasi paling depan.
- `experiences` untuk pengalaman yang memiliki struktur lebih kaya karena satu entitas dapat memuat beberapa role dalam satu organisasi atau institusi.
- `publications` untuk karya publikasi yang ingin ditampilkan sebagai bukti kontribusi akademik atau riset.

Pendekatan ini membuat isi homepage tetap ringkas karena hanya menampilkan sebagian data sebagai highlight, sementara halaman detail menampilkan daftar yang lebih lengkap. Dengan begitu, website bisa dipakai untuk membaca cepat maupun menelusuri isi secara lebih jauh.

Di level pengelolaan konten, proyek ini juga menyiapkan file data terstruktur di folder `scripts/data` seperti `projects.json`, `more-projects.json`, dan `experiences.json`. File-file ini berperan sebagai sumber data yang lebih mudah diedit dan ditinjau sebelum disinkronkan ke Firestore melalui script khusus. Model seperti ini sangat membantu karena perubahan konten bisa dilakukan secara lebih rapi, terkontrol, dan tidak bercampur langsung dengan kode presentasi.

## Peran Teknologi dalam Proyek

Website ini dibangun menggunakan React dan TypeScript untuk memastikan pengembangan antarmuka yang modular, modern, dan lebih aman secara tipe data. React Router digunakan untuk membagi pengalaman ke beberapa halaman tanpa kehilangan rasa aplikasi tunggal yang mulus. Vite berperan sebagai fondasi tooling yang ringan dan cepat, sehingga proses pengembangan dan build tetap efisien.

Untuk styling, proyek ini memanfaatkan Tailwind CSS dengan pendekatan utility-first yang memberi fleksibilitas tinggi dalam membentuk sistem visual yang khas. Pilihan ini cocok untuk proyek portfolio karena banyak area membutuhkan komposisi layout yang spesifik, variasi spacing yang halus, dan treatment visual yang konsisten antar section tanpa harus membangun CSS yang terlalu berat.

Firebase digunakan sebagai lapisan data utama, terutama Firestore untuk penyimpanan konten portfolio dan Firebase Storage untuk aset visual tertentu seperti hero image. Dengan integrasi ini, website dapat menampilkan data proyek, experience, publication, dan project tambahan secara terpusat. Pendekatan ini juga membuat pembaruan konten lebih praktis dibanding struktur yang sepenuhnya statis.

## Tujuan Proyek

Portfolio ini dibuat untuk merangkum hasil kerja, pengalaman, dan publikasi dalam format yang lebih tertata dibanding daftar biasa. Isi website tidak hanya menampilkan apa yang pernah dibuat, tetapi juga konteks bidang yang dikerjakan, jenis pengalaman yang pernah dijalani, serta susunan karya yang dianggap paling relevan.

Dengan struktur data yang rapi dan tampilan yang konsisten, website ini bisa dipakai sebagai media dokumentasi, presentasi diri, dan titik awal komunikasi dengan pihak lain yang ingin melihat project atau pengalaman secara singkat maupun lebih detail.
