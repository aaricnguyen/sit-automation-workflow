# Dashboard

The dashboard page shows general information and about profiles, clients, config files, INSIGHT list...

![Dashboard](./public/images/dashboard/dashboard.png)

## 1. Total config files

## 2. Total External Customers

## 3. Total Internal SIT profiles

## 4. Update data

When "Update Data" is clicked, all data will be calculated and updated again

## 5. Search Box

When you enter the keyword search, a list of keyword search suggestions will appear. When you press enter, you will be redirected to the search results list page

![Search suggestion](./public/images/dashboard/search-suggestion.png)


## 7. Insight List

Displays a list of INSIGHT configured on the Server

## 7. Summary Chart

### 7.1. Internal Customers Summary Chart

Default will display the chart "SIT Profiles - Internal Customers Summary"

![Internal Customers Summary Chart](./public/images/dashboard/chart1.png)

<div style="page-break-after: always;"></div>

When hovering over a column in the bar chart, the following information will appear:

+ Name of customer
+ Total number of customers
+ Number of matches 100%
+ Number of matches 90-99%
+ Number of matches 80-99%
+ Number of matches below 80%

When clicking on a column in the bar chart, the External Customer Summary chart will appear

### 7.2. External Customer Summary Chart

![External Customer Summary Chart](./public/images/dashboard/chart2.png)

- Can select to show top 10 or show all

- When hovering over a column in the bar chart, show the percentage of that external customer that matches the Internal Customer

- When clicking on a column in the bar chart, the Features Comparison Chart will appear

<div style="page-break-after: always;"></div>

### 7.3. Features Comparison Summary Chart

![Features Comparison Summary Chart](./public/images/dashboard/chart3.png)

- When hovering over the radar chart, shows the cateogry name, the number of features of the internal customer enabled, the number of features of the external customer enabled, the number of features not matching

- When clicking on the radar char, the Feature Comparison Table will appear

### 7.4. Feature Comparison Table

![Feature Comparison Table](./public/images/dashboard/chart4.png)
- The config highlighted in red with a yellow background are the profiles that do not match

- When clicking on a row in the table, the Configuration Details Table will appear
  
<div style="page-break-after: always;"></div>

### 7.5. Configuration Details Table

![Configuration Details Table](./public/images/dashboard/chart5.png)
- Config matches are highlighted

<div style="page-break-after: always;"></div>

# Upload Config

![Upload](./public/images/upload/upload.png)

Upload config page allows users to upload a new config file or zip file containing multiple new config files and compare them


## 1. Click or drag and drop files to upload

Can upload a new config file or zip file containing multiple new config files

## 2. Summary info and combination of external customer has just been uploaded

## 3. SIT Profiles Comparison of external customer has just been uploaded

<div style="page-break-after: always;"></div>

# Search Page 

Help find information about internal customer, external customer, feature,... in the best way.

## A. Search result list

After entering the search keyword in the search box and pressing enter, the list of results will display on the results list page.

![Result list](./public/images/search/result-list.png)

The result is returned as a list of links. When clicking on a link will be redirected to the details of the search results

## B. Search syntax and detailed results:

### 1. Search by internal customer, external customer 

  e.g: 
  > NGE

  ![Result search case 1 internal](./public/images/search/result-case1-internal.png)

### 2. Search by one single feature or multiple features  

e.g:
  > vtp and ssh

  ![Result search case2](./public/images/search/result-case2.png)

### 3. Search by single/multiple features + customer id(both external and internal) 

e.g:
  > vtp and ssh + education

  ![Result search case3](./public/images/search/result-case3.png)

<div style="page-break-after: always;"></div>

### 4. Search by negating the feature

e.g:
  > !(vtp and ssh)

  ![Result search case4](./public/images/search/result-case4.png)

### 5. Search by xor feature

e.g:
  > vtp xor ssh

  ![Result search case5](./public/images/search/result-case5.png)

<div style="page-break-after: always;"></div>

### 6. Scale search

e.g:
  > ipv6_count > 12 and static_route_count > 2

  ![Result search case6](./public/images/search/result-case6.png)

### 7. Search by feature and feature count

e.g:
  > ssh and ipv6_count > 12

  ![Result search case7](./public/images/search/result-case7.png)
