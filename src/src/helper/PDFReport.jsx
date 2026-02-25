
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    lineHeight: 1.4
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    minWidth: 100
  },
  content: {
    flex: 1
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  image: {
    maxWidth: '80%',
    maxHeight: 300,
    margin: 'auto'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey'
  }
});

const ReportContent = ({ report }) => (
  <>
    <Text style={styles.title}>Report Details</Text>
    
    <View style={styles.section}>
      <Text style={styles.label}>Title:</Text>
      <Text style={styles.content}>{report.title}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Details:</Text>
      <Text style={styles.content}>{report.details}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.content}>{report.type}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.content}>{report.status}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.content}>{report.specific_place || 'N/A'}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Reported By:</Text>
      <Text style={styles.content}>{report.name}</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.label}>Report Date:</Text>
      <Text style={styles.content}>
        {new Date(report.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
    </View>
    
    {report.accepted_by && (
      <View style={styles.section}>
        <Text style={styles.label}>Accepted By:</Text>
        <Text style={styles.content}>{report.accepted_by}</Text>
      </View>
    )}
    
    {report.image && (
      <View style={styles.imageContainer}>
        <Image 
          style={styles.image}
          src={report.image}
          cache={false}
        />
      </View>
    )}
  </>
);

// Fixed PDFReport component with proper Document and Page wrappers
const PDFReport = ({ report }) => (
  <Document>
    <Page style={styles.page} size="A4">
      <ReportContent report={report} />
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )}
        fixed
      />
    </Page>
  </Document>
);

const MultiPDFReport = ({ reports }) => (
  <Document>
    {reports.map((report, index) => (
      <Page 
        key={report.id || index} 
        style={styles.page}
        size="A4"
      >
        <ReportContent report={report} />
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )}
          fixed
        />
      </Page>
    ))}
  </Document>
);

export { PDFReport, MultiPDFReport };