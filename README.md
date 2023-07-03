
# BookingAPI (HerokuApp) Performance Testing using JMeter

This repository contains performance testing scripts and reports for the BookingAPI on HerokuApp. The performance testing was carried out using Apache JMeter, a popular open-source tool for load testing, to evaluate the system's capability to handle concurrent requests and measure its performance under different loads.


## Overview
The BookingAPI is a test site designed to simulate a booking API. It serves as a platform for testing and validating the performance of systems interacting with a booking API. The API is accessible via the base URL: https://restful-booker.herokuapp.com. It provides various endpoints for managing bookings, checking availability, and other related functionalities.
## Test Setup
The performance tests were conducted using JMeter with different levels of concurrency. Each test executed a specified number of concurrent requests with a fixed loop count to evaluate the system's response time, throughput, and error rate.

The following tests were performed:

1. 10 Concurrent Requests with 10 Loop Count:
- Average Transactions Per Second (TPS) for Total Samples: ~29
- Total Concurrent API Requests: 600

2. 100 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~202
- Total Concurrent API Requests: 6000

3. 500 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~758
- Total Concurrent API Requests: 30000

4. 1000 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~570
- Total Concurrent API Requests: 60000

5. 1300 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~750
- Total Concurrent API Requests: 78000

6. 1400 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~578
- Total Concurrent API Requests: 84000

7. 1500 Concurrent Requests with 10 Loop Count:
- Average TPS for Total Samples: ~545
- Total Concurrent API Requests: 90000

During the test execution with 1400 concurrent requests, 324 requests experienced connection timeouts, resulting in an error rate of 0.39%.
## Test Result
The performance test results indicate that the BookingAPI on HerokuApp can handle concurrent requests up to approximately 87,000 API calls with an error rate close to zero. The tests demonstrated the system's stability and ability to process a significant number of concurrent requests while maintaining acceptable response times and throughput.

To provide more insights into the test results, reports were generated for each of the concurrent request scenarios:

- [10 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T10.html)
- [100 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T100.html)
- [500 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T500.html)
- [1000 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T1000.html)
- [1300 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T1300.html)
- [1400 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T1400.html)
- [1500 Concurrent Requests Report](https://github.com/An-Nihal/Performance-Testing/tree/main/BookingAPI%20(HerokuApp)%20Performance%20Testing%20using%20JMeter/BookingApp_T1500.html)

Please refer to these reports for a detailed analysis of response times, throughput, and other performance metrics observed during the tests.
## Conclusion
Based on the performance testing results, it can be concluded that the BookingAPI on HerokuApp exhibits robust performance characteristics. The system showcases impressive scalability, handling tens of thousands of concurrent API requests with a negligible error rate.

These performance test findings provide
## Contributing
Contributions to this repository are welcome. If you have any improvements to the existing ones for this or any other web application, feel free to open an issue or submit a pull request. Your contributions will help enrich the repository and enhance the understanding of various applications through visual representations.
## Frequently Asked Questions (FAQs)

#### Question 1: What is the purpose of this repository?

Answer: This repository serves the purpose of documenting the performance testing conducted on the BookingAPI on HerokuApp using JMeter. It includes performance testing plans, test results, and generated reports for different levels of concurrency.

#### Question 2: What is the BookingAPI on HerokuApp?

Answer: The BookingAPI on HerokuApp is a test site designed to simulate a booking API. It provides endpoints for creating bookings, updating or deleting them, and related functionalities. It serves as a platform for testing and validating the performance of systems interacting with a booking API.

#### Question 3: What is JMeter, and why was it used for performance testing?

Answer: JMeter is an open-source tool widely used for load testing, performance testing, and stress testing of web applications and APIs. It allows testers to simulate various user scenarios, measure response times, throughput, and analyze system performance under different loads. JMeter was chosen for this project to evaluate the performance and scalability of the BookingAPI.

#### Question 4: How were the performance tests conducted?

Answer: The performance tests were conducted by executing a series of concurrent requests with different levels of concurrency using JMeter. Each test had a fixed loop count to ensure repeatability. The response times, throughput, and error rates were measured and analyzed to assess the performance of the BookingAPI under varying loads.

#### Question 5: What were the key findings from the performance tests?

Answer: The performance tests revealed that the BookingAPI on HerokuApp can handle concurrent requests up to approximately 87,000 API calls with an error rate close to zero. The system demonstrated stability and scalability, exhibiting acceptable response times and throughput even under high loads.

#### Question 6: How can I contribute to this repository?

Answer: Contributions to this repository are welcome! If you have suggestions, improvements, or additional performance tests to share, you can fork this repository, make your changes, and submit a pull request. Please ensure that your contributions align with the purpose and scope of this project.



