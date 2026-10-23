#include <Arduino.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <time.h>
// ================= CẤU HÌNH WIFI =================
const char* ssid       = "Hanh";      // Thay tên wifi nhà bạn
const char* password   = "bjchh@nh93911868";         // Thay mật khẩu wifi
// Cấu hình máy chủ thời gian thế giới (NTP)
const char* ntpServer          = "pool.ntp.org";
const long  gmtOffset_sec      = 7 * 3600;        // Múi giờ Việt Nam: GMT+7 = 7 * 3600 giây
const int   daylightOffset_sec = 0;               // Việt Nam không dùng giờ mùa hè
// ================= CẤU HÌNH CHÂN KẾT NỐI =================
#define DHTPIN        4      // Chân Data của DHT11 kết nối GPIO 4
#define DHTTYPE       DHT11
#define FLAME_PIN     26      // Chân DO của cảm biến Lửa kết nối GPIO 26
#define MQ2_ANALOG    34      // Chân AO của cảm biến Gas MQ-2 kết nối GPIO 34 (ADC1)
#define BUZZER_PIN    15      // Chân tín hiệu còi Buzzer kết nối GPIO 15

// ================= CẤU HÌNH NGƯỠNG AN TOÀN =================
#define TEMP_WARN_THRESHOLD   45.0    // Nhiệt độ môi trường cao > 50°C thì báo động
#define GAS_THRESHOLD         1500    // Khí gas vượt ngưỡng 1500 thì báo động

// Cấu hình mức còi (Mặc định: HIGH = Kêu, LOW = Im lặng)
// Nếu còi bị ngược (an toàn lại kêu) -> Chỉ cần đổi LOW thành HIGH và ngược lại ở 2 dòng này:
#define BUZZER_ON     HIGH
#define BUZZER_OFF    LOW

DHT dht(DHTPIN, DHTTYPE);
String getFormattedTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "[Chưa đồng bộ giờ]";
  }
  char timeStringBuff[30];
  // Định dạng: Giờ:Phút:Giây Ngày/Tháng/Năm
  strftime(timeStringBuff, sizeof(timeStringBuff), "%H:%M:%S %d/%m/%Y", &timeinfo);
  return String(timeStringBuff);
}

void setup() {
  Serial.begin(9600);       
  delay(1000);

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(FLAME_PIN, INPUT);

  // MẶC ĐỊNH LÚC KHỞI ĐỘNG: CÒI PHẢI TẮT IM LẶNG
  digitalWrite(BUZZER_PIN, BUZZER_OFF);

  dht.begin();
   // Kết nối Wi-Fi để lấy giờ thực
  Serial.print("Đang kết nối WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 15) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi đã kết nối!");
    // Đồng bộ thời gian với máy chủ thế giới
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.println("Đã đồng bộ giờ thực qua Internet thành công!");
  } else {
    Serial.println("\nKhông kết nối được WiFi! Chạy chế độ không có giờ thực.");
  }
}


void loop() {
  // 1. Đọc dữ liệu từ các cảm biến
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int flameState = digitalRead(FLAME_PIN);
  int gasValue = analogRead(MQ2_ANALOG);

  // Module cảm biến lửa thường xuất mức LOW khi phát hiện có ngọn lửa
  bool isFlameDetected = (flameState == LOW);

  // 2. In các thông số đo được ra Serial Monitor để theo dõi
  String currentTime = getFormattedTime();

  // In thông số ra màn hình kèm thời gian thực
    Serial.printf("⏰ THỜI GIAN: %s\n", currentTime.c_str());
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("1. Nhiệt độ DHT11: [LỖI ĐỌC DÂY CẮM]");
  } else {
    Serial.printf("1. Nhiệt độ: %.1f *C | Độ ẩm: %.1f %%\n", temperature, humidity);
  }
  Serial.printf("2. Cảm biến Lửa (DO): %d (%s)\n", flameState, isFlameDetected ? "PHÁT HIỆN CÓ LỬA!" : "An toàn");
  Serial.printf("3. Cảm biến Gas MQ-2: %d / 4095 (Ngưỡng: %d)\n", gasValue, GAS_THRESHOLD);

  // 3. Xét các điều kiện kích hoạt báo động
  bool alarm = false;
  String reason = "";

  // Điều kiện 1: Phát hiện ngọn lửa VÀ nhiệt độ >= 80 độ C
  if (isFlameDetected ) {
    alarm = true;
    reason += "[CHÁY NGUY HIỂM: Có lửa ] ";
  }

  // Điều kiện 2: Nhiệt độ môi trường quá cao (> 50 độ C)
  if (!isnan(temperature) && (temperature > TEMP_WARN_THRESHOLD)) {
    alarm = true;
    reason += "[CẢNH BÁO NHIỆT ĐỘ CAO > 50°C] ";
  }

  // Điều kiện 3: Phát hiện rò rỉ khí Gas vượt ngưỡng an toàn
  if (gasValue >= GAS_THRESHOLD) {
    alarm = true;
    reason += "[CẢNH BÁO RÒ RỈ KHÍ GAS] ";
  }

  // ================= 4. ĐIỀU KHIỂN CÒI BUZZER =================
  if (alarm) {
    // VƯỢT NGƯỠNG AN TOÀN -> BẬT CÒI
    Serial.println(">>> TRẠNG THÁI: KÍCH HOẠT CÒI BÁO ĐỘNG! <<<");
    Serial.println("Lý do: " + reason);
    digitalWrite(BUZZER_PIN, BUZZER_ON);
  } else {
    // TẤT CẢ ĐỀU AN TOÀN -> CÒI IM LẶNG
    Serial.println(">>> TRẠNG THÁI: AN TOÀN (Còi tắt)");
    digitalWrite(BUZZER_PIN, BUZZER_OFF);
  }

  delay(1500); // Đợi 1.5 giây trước khi đọc chu kỳ tiếp theo
}
