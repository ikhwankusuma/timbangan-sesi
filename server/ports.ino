const int henry = 5;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  digitalWrite(8, HIGH);
  digitalWrite(9, HIGH);
  Serial.println("yes");
}

void loop() {
  // put your main code here, to run repeatedly
  String readString;
  String Q;

  Serial.println("p");
  while (Serial.available()) {

    delay(1);
    if (Serial.available() > 0) {
      char c = Serial.read();
      if (isControl(c)) {
        break;
      }
      readString += c;
    }
  }
  Q = readString;
  if (Q == "p") {
    Serial.println("yes");
  }

  if (Q == "on") {
    digitalWrite(9, LOW);
    tone(henry, 255);
    delay(305);   
    tone(henry, 355);
    delay(205);  
    tone(henry, 555);
    delay(155);  
    noTone(henry);
//    Serial.println("success");
     digitalWrite(9, LOW);
  }
  if (Q == "off") {
//    Serial.println("success");
    digitalWrite(9, HIGH);
    
  }
}
