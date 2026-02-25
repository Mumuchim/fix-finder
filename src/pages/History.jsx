// // // // import React, { useState, useEffect } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import {
// // // //     Box,
// // // //     Typography,
// // // //     Card,
// // // //     CardContent,
// // // //     CardMedia,
// // // //     Button,
// // // //     Grid,
// // // //     Container,
// // // //     Chip,
// // // //     Select,
// // // //     MenuItem,
// // // //     InputLabel,
// // // //     FormControl,
// // // // } from "@mui/material";
// // // // import { styled } from "@mui/system";
// // // // import { FaTrash, FaRadiation } from "react-icons/fa";
// // // // import { useTheme } from '@mui/material/styles';
// // // // import Navbar from '../components/Navbar';
// // // // import supabase from "../helper/supabaseClient";
// // // // import CircularProgress from '@mui/material/CircularProgress';

// // // // const REPORT_PRIORITY = {
// // // //     'Caution': { level: 'High', order: 1, color: 'error' },
// // // //     'Electrical': { level: 'High', order: 1, color: 'error' },
// // // //     'Repair': { level: 'Medium', order: 2, color: 'warning' },
// // // //     'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
// // // //     'Cleaning': { level: 'Low', order: 4, color: 'info' },
// // // //     'Request': { level: 'Low', order: 4, color: 'info' }
// // // // };

// // // // const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
// // // //     REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
// // // // );

// // // // const StyledCard = styled(Card)(({ theme }) => ({
// // // //     marginBottom: "1rem",
// // // //     transition: "transform 0.2s",
// // // //     "&:hover": {
// // // //         transform: "translateY(-4px)",
// // // //         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
// // // //     },
// // // // }));

// // // // const History = () => {
// // // //     const navigate = useNavigate();
// // // //     const [formData, setFormData] = useState({
// // // //         name: "",
// // // //         lastName: "",
// // // //         email: "",
// // // //         role: "",
// // // //         customUid: "",
// // // //     });

// // // //     const [reports, setReports] = useState([]);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [isDeletingAll, setIsDeletingAll] = useState(false);
// // // //     const [typeFilter, setTypeFilter] = useState('all');
// // // //     const [statusFilter, setStatusFilter] = useState('all');

// // // //     const theme = useTheme();
// // // //     const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];

// // // //     useEffect(() => {
// // // //         const fetchUserInfo = async () => {
// // // //             const { data: { user }, error } = await supabase.auth.getUser();
// // // //             if (error) {
// // // //                 console.error('Error fetching user:', error);
// // // //                 return;
// // // //             }
// // // //             if (user) {
// // // //                 const { data: userDetails, error: userError } = await supabase
// // // //                     .from('users')
// // // //                     .select('fname, lname, role, id')
// // // //                     .eq('id', user.id)
// // // //                     .single();
// // // //                 if (userError) {
// // // //                     console.error('Error fetching user details:', userError);
// // // //                 } else {
// // // //                     setFormData({
// // // //                         name: `${userDetails.fname} ${userDetails.lname}`,
// // // //                         lastName: userDetails.lname,
// // // //                         email: user.email,
// // // //                         role: userDetails.role,
// // // //                         customUid: userDetails.id,
// // // //                     });
// // // //                 }
// // // //             }
// // // //         };
// // // //         fetchUserInfo();
// // // //     }, []);

// // // //     useEffect(() => {
// // // //         if (formData.customUid) {
// // // //             fetchReports();
// // // //         }
// // // //     }, [formData.customUid]);

// // // //     // Add this useEffect to set filter for IT Admins
// // // // useEffect(() => {
// // // //     if (formData.role === 'IT Admin') {
// // // //         setTypeFilter('IT Maintenance');
// // // //     }
// // // // }, [formData.role]);


// // // //     // const fetchReports = async () => {
// // // //     //     try {
// // // //     //         let query = supabase
// // // //     //             .from('reports')
// // // //     //             .select('id, title, details, status, type, image, created_at, name, specific_place, pinid')
// // // //     //             .order('created_at', { ascending: false });

// // // //     //         if (formData.role !== 'admin') {
// // // //     //             query = query.eq('user_uid', formData.customUid);
// // // //     //         }

// // // //     //         const { data: reportsData, error: reportsError } = await query;

// // // //     //         if (reportsError) {
// // // //     //             console.error("Error fetching reports:", reportsError);
// // // //     //             return;
// // // //     //         }

// // // //     //         let sortedReports = reportsData;
// // // //     //         if (formData.role === 'admin') {
// // // //     //             sortedReports = [...reportsData].sort((a, b) => {
// // // //     //                 const priorityA = REPORT_PRIORITY[a.type]?.order || 99;
// // // //     //                 const priorityB = REPORT_PRIORITY[b.type]?.order || 99;
// // // //     //                 return priorityA - priorityB;
// // // //     //             });
// // // //     //         }

// // // //     //         setReports(sortedReports);
// // // //     //     } catch (error) {
// // // //     //         console.error("Error fetching reports:", error);
// // // //     //     } finally {
// // // //     //         setLoading(false);
// // // //     //     }
// // // //     // };

// // // //     const fetchReports = async () => {
// // // //         try {
// // // //             let query = supabase
// // // //                 .from('reports')
// // // //                 .select('id, title, details, status, type, image, created_at, name, specific_place, pinid')
// // // //                 .order('created_at', { ascending: false });
    
// // // //             // Add role-based filtering
// // // //             if (formData.role === 'IT Admin') {
// // // //                 query = query.eq('type', 'IT Maintenance');
// // // //             } else if (formData.role !== 'admin') {
// // // //                 query = query.eq('user_uid', formData.customUid);
// // // //             }
    
// // // //             const { data: reportsData, error: reportsError } = await query;
    
// // // //             if (reportsError) {
// // // //                 console.error("Error fetching reports:", reportsError);
// // // //                 return;
// // // //             }
    
// // // //             let sortedReports = reportsData;
// // // //             if (formData.role === 'admin') {
// // // //                 sortedReports = [...reportsData].sort((a, b) => {
// // // //                     const priorityA = REPORT_PRIORITY[a.type]?.order || 99;
// // // //                     const priorityB = REPORT_PRIORITY[b.type]?.order || 99;
// // // //                     return priorityA - priorityB;
// // // //                 });
// // // //             }
    
// // // //             setReports(sortedReports);
// // // //         } catch (error) {
// // // //             console.error("Error fetching reports:", error);
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };


// // // //     const handleDeleteReport = async (id) => {
// // // //         if (!window.confirm("Are you sure you want to delete this report?")) return;
    
// // // //         try {
// // // //             const { data: reportData, error: reportError } = await supabase
// // // //                 .from('reports')
// // // //                 .select('pinid')
// // // //                 .eq('id', id)
// // // //                 .single();

// // // //             if (reportError) throw reportError;

// // // //             if (reportData.pinid) {
// // // //                 await supabase
// // // //                     .from('pins')
// // // //                     .delete()
// // // //                     .eq('pinid', reportData.pinid);
// // // //             }

// // // //             const { error: reportsError } = await supabase
// // // //                 .from('reports')
// // // //                 .delete()
// // // //                 .eq('id', id);

// // // //             if (reportsError) throw reportsError;

// // // //             setReports(prev => prev.filter(report => report.id !== id));
            
// // // //         } catch (error) {
// // // //             console.error("Deletion failed:", error);
// // // //             alert(`Deletion failed: ${error.message}`);
// // // //         }
// // // //     };

// // // //     const handleDeleteAllReports = async () => {
// // // //         try {
// // // //             const { data: { user }, error: authError } = await supabase.auth.getUser();
// // // //             if (authError || !user) throw new Error("Authentication required");

// // // //             const isAdmin = formData.role === 'admin';
// // // //             const confirmMessage = isAdmin 
// // // //                 ? "WARNING: This will delete ALL reports for ALL users! Are you sure?"
// // // //                 : "Are you sure you want to delete all YOUR reports? This cannot be undone.";

// // // //             if (!window.confirm(confirmMessage)) return;

// // // //             let reportsQuery = supabase
// // // //                 .from('reports')
// // // //                 .select('id, pinid, user_uid');

// // // //             if (!isAdmin) {
// // // //                 reportsQuery = reportsQuery.eq('user_uid', user.id);
// // // //             }

// // // //             const { data: allReports, error: fetchError } = await reportsQuery;
// // // //             if (fetchError) throw fetchError;

// // // //             if (!allReports || allReports.length === 0) {
// // // //                 alert(isAdmin ? "No reports to delete" : "You have no reports to delete");
// // // //                 return;
// // // //             }

// // // //             const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))];
// // // //             if (pinIds.length > 0) {
// // // //                 await supabase
// // // //                     .from('pins')
// // // //                     .delete()
// // // //                     .in('pinid', pinIds);
// // // //             }

// // // //             const reportIds = allReports.map(report => report.id);
// // // //             await supabase
// // // //                 .from('reports')
// // // //                 .delete()
// // // //                 .in('id', reportIds);

// // // //             setReports([]);
// // // //             alert(isAdmin 
// // // //                 ? `Deleted ${reportIds.length} reports and ${pinIds.length} pins successfully!`
// // // //                 : "Your reports have been deleted successfully");

// // // //         } catch (error) {
// // // //             console.error("Deletion failed:", error);
// // // //             alert(`Error: ${error.message}`);
// // // //         }
// // // //     };

// // // //     const getStatusColor = (status) => {
// // // //         switch (status.toLowerCase()) {
// // // //             case "resolved": return "success";
// // // //             case "pending": return "warning";
// // // //             case "in progress": return "info";
// // // //             case "denied": return "error";
// // // //             default: return "default";
// // // //         }
// // // //     };

// // // //     if (loading) {
// // // //         return (
// // // //             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
// // // //                 <CircularProgress size="4rem" />
// // // //             </Box>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <Container maxWidth="lg" sx={{ py: 4 }}>
// // // //             <Navbar userDetails={formData} />
            
// // // //             <Box sx={{ 
// // // //                 display: 'flex', 
// // // //                 flexDirection: { xs: 'column', md: 'row' }, 
// // // //                 justifyContent: 'space-between', 
// // // //                 alignItems: 'center', 
// // // //                 mb: 3, 
// // // //                 gap: 2 
// // // //             }}>
// // // //                 <Typography variant="h4" component="h1">
// // // //                     Report History
// // // //                 </Typography>
                
// // // //                 <Box sx={{ 
// // // //                     display: 'flex', 
// // // //                     gap: 2, 
// // // //                     alignItems: 'center',
// // // //                     width: { xs: '100%', md: 'auto' },
// // // //                     flexDirection: { xs: 'column', md: 'row' }
// // // //                 }}>
// // // //                     {/* <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
// // // //                         <InputLabel>Filter by Type</InputLabel>
// // // //                         <Select
// // // //                             value={typeFilter}
// // // //                             onChange={(e) => setTypeFilter(e.target.value)}
// // // //                             label="Filter by Type"
// // // //                         >
// // // //                             <MenuItem value="all">All Types</MenuItem>
// // // //                             {reportTypes.map((type) => (
// // // //                                 <MenuItem key={type} value={type}>{type}</MenuItem>
// // // //                             ))}
// // // //                         </Select>
// // // //                     </FormControl> */}

// // // // <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
// // // //     <InputLabel>Filter by Type</InputLabel>
// // // //     <Select
// // // //         value={typeFilter}
// // // //         onChange={(e) => setTypeFilter(e.target.value)}
// // // //         label="Filter by Type"
// // // //         disabled={formData.role === 'IT Admin'}
// // // //     >
// // // //         <MenuItem value="all">All Types</MenuItem>
// // // //         {reportTypes.map((type) => (
// // // //             <MenuItem key={type} value={type}>{type}</MenuItem>
// // // //         ))}
// // // //     </Select>
// // // // </FormControl>

// // // //                     <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
// // // //                         <InputLabel>Filter by Status</InputLabel>
// // // //                         <Select
// // // //                             value={statusFilter}
// // // //                             onChange={(e) => setStatusFilter(e.target.value)}
// // // //                             label="Filter by Status"
// // // //                         >
// // // //                             <MenuItem value="all">All Statuses</MenuItem>
// // // //                             {statusOptions.map((status) => (
// // // //                                 <MenuItem key={status} value={status}>
// // // //                                     {status.charAt(0).toUpperCase() + status.slice(1)}
// // // //                                 </MenuItem>
// // // //                             ))}
// // // //                         </Select>
// // // //                     </FormControl>

// // // //                     <Button
// // // //                         variant="contained"
// // // //                         color="error"
// // // //                         startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
// // // //                         onClick={handleDeleteAllReports}
// // // //                         disabled={isDeletingAll || reports.length === 0}
// // // //                         sx={{ 
// // // //                             minWidth: 200,
// // // //                             width: { xs: '100%', md: 'auto' }
// // // //                         }}
// // // //                     >
// // // //                         {isDeletingAll ? 'Deleting...' : (
// // // //                             formData.role === 'admin' ? 'Delete All' : 'Delete Mine'
// // // //                         )}
// // // //                     </Button>
// // // //                 </Box>
// // // //             </Box>

// // // //             {reports.length === 0 ? (
// // // //                 <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
// // // //                     No reports available.
// // // //                 </Typography>
// // // //             ) : (
// // // //                 <Grid container spacing={3}>
// // // //                     {reports
// // // //                         .filter(report => 
// // // //                             (typeFilter === 'all' || report.type === typeFilter) &&
// // // //                             (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase())
// // // //                         )
// // // //                         .map((report) => {
// // // //                             const isClickable = ['pending', 'in progress'].includes(report.status.toLowerCase());
                            
// // // //                             return (
// // // //                                 <Grid item xs={12} key={report.id}>
// // // //                                     <StyledCard
// // // //                                         onClick={() => {
// // // //                                             if (isClickable) {
// // // //                                                 navigate(`/status/${report.pinid}`);
// // // //                                             }
// // // //                                         }}
// // // //                                         sx={{
// // // //                                             cursor: isClickable ? 'pointer' : 'default',
// // // //                                             '&:hover': {
// // // //                                                 transform: isClickable ? 'translateY(-4px)' : 'none'
// // // //                                             }
// // // //                                         }}
// // // //                                     >
// // // //                                         <Grid container>
// // // //                                             <Grid item xs={12} md={4}>
// // // //                                                 {report.image ? (
// // // //                                                     <CardMedia
// // // //                                                         component="img"
// // // //                                                         height="200"
// // // //                                                         image={report.image}
// // // //                                                         alt={report.title}
// // // //                                                         style={{ cursor: "pointer" }}
// // // //                                                         onClick={(e) => {
// // // //                                                             e.stopPropagation();
// // // //                                                             window.open(report.image, "_blank");
// // // //                                                         }}
// // // //                                                     />
// // // //                                                 ) : (
// // // //                                                     <Box
// // // //                                                         sx={{
// // // //                                                             height: 200,
// // // //                                                             backgroundColor: "#f0f0f0",
// // // //                                                             display: "flex",
// // // //                                                             justifyContent: "center",
// // // //                                                             alignItems: "center",
// // // //                                                             color: "#888",
// // // //                                                         }}
// // // //                                                     >
// // // //                                                         No Image Available
// // // //                                                     </Box>
// // // //                                                 )}
// // // //                                             </Grid>
// // // //                                             <Grid item xs={12} md={8}>
// // // //                                                 <CardContent>
// // // //                                                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
// // // //                                                         <Typography variant="h6" component="h2">
// // // //                                                             {report.title}
// // // //                                                         </Typography>
// // // //                                                         <Button
// // // //                                                             color="error"
// // // //                                                             startIcon={<FaTrash />}
// // // //                                                             onClick={(e) => {
// // // //                                                                 e.stopPropagation();
// // // //                                                                 handleDeleteReport(report.id);
// // // //                                                             }}
// // // //                                                         />
// // // //                                                     </Box>
// // // //                                                     <Typography variant="body1" paragraph>
// // // //                                                         {report.details}
// // // //                                                     </Typography>
// // // //                                                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
// // // //                                                         {formData.role === 'admin' && (
// // // //                                                             <Chip 
// // // //                                                                 label={`Priority: ${REPORT_PRIORITY[report.type]?.level || 'Normal'}`}
// // // //                                                                 color={REPORT_PRIORITY[report.type]?.color || 'default'}
// // // //                                                                 variant="filled"
// // // //                                                             />
// // // //                                                         )}
// // // //                                                         <Chip label={`Type: ${report.type}`} variant="outlined" />
// // // //                                                         <Chip 
// // // //                                                             label={`Status: ${report.status}`} 
// // // //                                                             color={getStatusColor(report.status)} 
// // // //                                                         />
// // // //                                                         <Chip label={`Created: ${new Date(report.created_at).toLocaleString()}`} />
// // // //                                                         <Chip label={`Reporter: ${report.name}`} />
// // // //                                                         <Chip label={`Location: ${report.specific_place}`} />
// // // //                                                     </Box>
// // // //                                                 </CardContent>
// // // //                                             </Grid>
// // // //                                         </Grid>
// // // //                                     </StyledCard>
// // // //                                 </Grid>
// // // //                             );
// // // //                         })}
// // // //                 </Grid>
// // // //             )}
// // // //         </Container>
// // // //     );
// // // // };

// // // // export default History;

// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //     Box,
// // //     Typography,
// // //     Card,
// // //     CardContent,
// // //     CardMedia,
// // //     Button,
// // //     Grid,
// // //     Container,
// // //     Chip,
// // //     Select,
// // //     MenuItem,
// // //     InputLabel,
// // //     FormControl,
// // // } from "@mui/material";
// // // import { styled } from "@mui/system";
// // // import { FaTrash, FaRadiation } from "react-icons/fa";
// // // import { useTheme } from '@mui/material/styles';
// // // import Navbar from '../components/Navbar';
// // // import supabase from "../helper/supabaseClient";
// // // import CircularProgress from '@mui/material/CircularProgress';
// // // import { useReactToPrint } from 'react-to-print';
// // // import { useRef, forwardRef } from 'react';

// // // const REPORT_PRIORITY = {
// // //     'Caution': { level: 'High', order: 1, color: 'error' },
// // //     'Electrical': { level: 'High', order: 1, color: 'error' },
// // //     'Repair': { level: 'Medium', order: 2, color: 'warning' },
// // //     'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
// // //     'Cleaning': { level: 'Low', order: 4, color: 'info' },
// // //     'Request': { level: 'Low', order: 4, color: 'info' }
// // // };

// // // const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
// // //     REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
// // // );

// // // const StyledCard = styled(Card)(({ theme }) => ({
// // //     marginBottom: "1rem",
// // //     transition: "transform 0.2s",
// // //     "&:hover": {
// // //         transform: "translateY(-4px)",
// // //         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
// // //     },
// // // }));

// // // const PrintableReport = forwardRef(({ report }, ref) => (
// // //     <div ref={ref} style={{ padding: '20px' }}>
// // //       <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Report Details</h1>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Title:</strong> {report.title}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Details:</strong> {report.details}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Type:</strong> {report.type}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Status:</strong> {report.status}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Location:</strong> {report.specific_place}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Reported By:</strong> {report.name}
// // //       </div>
// // //       <div style={{ marginBottom: '15px' }}>
// // //         <strong>Report Date:</strong> {new Date(report.created_at).toLocaleDateString()}
// // //       </div>
// // //       {report.accepted_by && (
// // //         <div style={{ marginBottom: '15px' }}>
// // //           <strong>Accepted By:</strong> {report.accepted_by}
// // //         </div>
// // //       )}
// // //       {report.image && (
// // //         <div style={{ marginTop: '20px' }}>
// // //           <img 
// // //             src={report.image} 
// // //             alt="Report" 
// // //             style={{ maxWidth: '100%', height: 'auto' }}
// // //           />
// // //         </div>
// // //       )}
// // //     </div>
// // //   ));

// // //   const PrintableAllReports = forwardRef(({ reports }, ref) => (
// // //     <div ref={ref} style={{ padding: '20px' }}>
// // //       <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
// // //         {reports.length} Report{reports.length !== 1 ? 's' : ''}
// // //       </h1>
// // //       {reports.map((report, index) => (
// // //         <div key={report.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
// // //           <h2>Report #{index + 1}</h2>
// // //           <PrintableReport report={report} />
// // //           <hr style={{ margin: '20px 0' }} />
// // //         </div>
// // //       ))}
// // //     </div>
// // //   ));

// // // const History = () => {
// // //     const navigate = useNavigate();
// // //     const [formData, setFormData] = useState({
// // //         name: "",
// // //         lastName: "",
// // //         email: "",
// // //         role: "",
// // //         customUid: "",
// // //     });

// // //     const [reports, setReports] = useState([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [isDeletingAll, setIsDeletingAll] = useState(false);
// // //     const [typeFilter, setTypeFilter] = useState('all');
// // //     const [statusFilter, setStatusFilter] = useState('all');
// // //     const [fetchError, setFetchError] = useState(null);

// // //     const theme = useTheme();
// // //     const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];
// // //     const componentRef = useRef();
// // //     const allReportsRef = useRef();
  
// // //     const handlePrintSingle = useReactToPrint({
// // //       content: () => componentRef.current,
// // //     });
  
// // //     const handlePrintAll = useReactToPrint({
// // //       content: () => allReportsRef.current,
// // //     });
  

// // //     // Fetch user information
// // //     useEffect(() => {
// // //         const fetchUserInfo = async () => {
// // //             try {
// // //                 console.log("Fetching user info...");
// // //                 const { data: { user }, error } = await supabase.auth.getUser();
                
// // //                 if (error) {
// // //                     console.error('Error fetching user:', error);
// // //                     setFetchError("Authentication error: " + error.message);
// // //                     setLoading(false);
// // //                     return;
// // //                 }
                
// // //                 if (!user) {
// // //                     console.error('No user found');
// // //                     setFetchError("No authenticated user found");
// // //                     setLoading(false);
// // //                     return;
// // //                 }
                
// // //                 console.log("User found:", user.id);
                
// // //                 const { data: userDetails, error: userError } = await supabase
// // //                     .from('users')
// // //                     .select('fname, lname, role, id')
// // //                     .eq('id', user.id)
// // //                     .single();
                
// // //                 if (userError) {
// // //                     console.error('Error fetching user details:', userError);
// // //                     setFetchError("Error fetching user details: " + userError.message);
// // //                     setLoading(false);
// // //                 } else {
// // //                     console.log("User details found:", userDetails);
// // //                     setFormData({
// // //                         name: `${userDetails.fname} ${userDetails.lname}`,
// // //                         lastName: userDetails.lname,
// // //                         email: user.email,
// // //                         role: userDetails.role,
// // //                         customUid: userDetails.id,
// // //                     });
// // //                 }
// // //             } catch (error) {
// // //                 console.error("Unexpected error during user fetch:", error);
// // //                 setFetchError("Unexpected error: " + error.message);
// // //                 setLoading(false);
// // //             }
// // //         };
        
// // //         fetchUserInfo();
// // //     }, []);

// // //     // Set type filter based on role and trigger report fetch when user data is ready
// // //     useEffect(() => {
// // //         if (formData.customUid) {
// // //             console.log("User role detected:", formData.role);
            
// // //             // Set type filter for IT Admin
// // //             if (formData.role === 'it admin') {
// // //                 console.log("Setting filter to IT Maintenance for IT Admin");
// // //                 setTypeFilter('IT Maintenance');
// // //             }
            
// // //             // Fetch reports
// // //             fetchReports();
// // //         }
// // //     }, [formData.customUid, formData.role]);

// // //     const fetchReports = async () => {
// // //         try {
// // //             console.log("Fetching reports for role:", formData.role);
// // //             setLoading(true);
// // //             setFetchError(null);
            
// // //             let query = supabase
// // //                 .from('reports')
// // //                 .select('id, title, details, status, type, image, created_at, name, specific_place, pinid, accepted_by')
// // //                 .order('created_at', { ascending: false });
    
// // //             // Apply role-based filtering
// // //             if (formData.role === 'it admin') {
// // //                 console.log("Applying IT Admin filter: type = IT Maintenance");
// // //                 query = query.eq('type', 'IT Maintenance');
// // //             } else if (formData.role !== 'admin') {
// // //                 console.log("Applying regular user filter: user_uid =", formData.customUid);
// // //                 query = query.eq('user_uid', formData.customUid);
// // //             } else {
// // //                 console.log("No filter for admin role");
// // //             }
    
// // //             console.log("Executing query...");
// // //             const { data: reportsData, error: reportsError } = await query;
    
// // //             if (reportsError) {
// // //                 console.error("Error fetching reports:", reportsError);
// // //                 setFetchError("Error fetching reports: " + reportsError.message);
// // //                 return;
// // //             }
    
// // //             console.log(`Query returned ${reportsData?.length || 0} reports`);
            
// // //             let sortedReports = reportsData || [];
// // //             if (formData.role === 'admin' && reportsData) {
// // //                 console.log("Sorting reports by priority for admin");
// // //                 sortedReports = [...reportsData].sort((a, b) => {
// // //                     const priorityA = REPORT_PRIORITY[a.type]?.order || 99;
// // //                     const priorityB = REPORT_PRIORITY[b.type]?.order || 99;
// // //                     return priorityA - priorityB;
// // //                 });
// // //             }
    
// // //             setReports(sortedReports);
// // //         } catch (error) {
// // //             console.error("Unexpected error fetching reports:", error);
// // //             setFetchError("Unexpected error: " + error.message);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleDeleteReport = async (id) => {
// // //         if (!window.confirm("Are you sure you want to delete this report?")) return;
    
// // //         try {
// // //             const { data: reportData, error: reportError } = await supabase
// // //                 .from('reports')
// // //                 .select('pinid')
// // //                 .eq('id', id)
// // //                 .single();

// // //             if (reportError) throw reportError;

// // //             if (reportData.pinid) {
// // //                 await supabase
// // //                     .from('pins')
// // //                     .delete()
// // //                     .eq('pinid', reportData.pinid);
// // //             }

// // //             const { error: reportsError } = await supabase
// // //                 .from('reports')
// // //                 .delete()
// // //                 .eq('id', id);

// // //             if (reportsError) throw reportsError;

// // //             setReports(prev => prev.filter(report => report.id !== id));
            
// // //         } catch (error) {
// // //             console.error("Deletion failed:", error);
// // //             alert(`Deletion failed: ${error.message}`);
// // //         }
// // //     };

// // //     const handleDeleteAllReports = async () => {
// // //         try {
// // //             const { data: { user }, error: authError } = await supabase.auth.getUser();
// // //             if (authError || !user) throw new Error("Authentication required");

// // //             const isAdmin = formData.role === 'admin';
// // //             const isITAdmin = formData.role === 'it admin';
            
// // //             let confirmMessage;
// // //             if (isAdmin) {
// // //                 confirmMessage = "WARNING: This will delete ALL reports for ALL users! Are you sure?";
// // //             } else if (isITAdmin) {
// // //                 confirmMessage = "WARNING: This will delete ALL IT Maintenance reports! Are you sure?";
// // //             } else {
// // //                 confirmMessage = "Are you sure you want to delete all YOUR reports? This cannot be undone.";
// // //             }

// // //             if (!window.confirm(confirmMessage)) return;

// // //             let reportsQuery = supabase
// // //                 .from('reports')
// // //                 .select('id, pinid, user_uid');

// // //             if (isITAdmin) {
// // //                 // IT Admins can only delete IT Maintenance reports
// // //                 reportsQuery = reportsQuery.eq('type', 'IT Maintenance');
// // //             } else if (!isAdmin) {
// // //                 // Regular users can only delete their own reports
// // //                 reportsQuery = reportsQuery.eq('user_uid', user.id);
// // //             }
// // //             // Admins can delete all reports

// // //             const { data: allReports, error: fetchError } = await reportsQuery;
// // //             if (fetchError) throw fetchError;

// // //             if (!allReports || allReports.length === 0) {
// // //                 let message = "No reports to delete";
// // //                 if (isITAdmin) message = "No IT Maintenance reports to delete";
// // //                 if (!isAdmin && !isITAdmin) message = "You have no reports to delete";
                
// // //                 alert(message);
// // //                 return;
// // //             }

// // //             const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))];
// // //             if (pinIds.length > 0) {
// // //                 await supabase
// // //                     .from('pins')
// // //                     .delete()
// // //                     .in('pinid', pinIds);
// // //             }

// // //             const reportIds = allReports.map(report => report.id);
// // //             await supabase
// // //                 .from('reports')
// // //                 .delete()
// // //                 .in('id', reportIds);

// // //             setReports([]);
            
// // //             let successMessage;
// // //             if (isAdmin) {
// // //                 successMessage = `Deleted ${reportIds.length} reports and ${pinIds.length} pins successfully!`;
// // //             } else if (isITAdmin) {
// // //                 successMessage = `Deleted ${reportIds.length} IT Maintenance reports and ${pinIds.length} pins successfully!`;
// // //             } else {
// // //                 successMessage = "Your reports have been deleted successfully";
// // //             }
            
// // //             alert(successMessage);

// // //         } catch (error) {
// // //             console.error("Deletion failed:", error);
// // //             alert(`Error: ${error.message}`);
// // //         }
// // //     };

// // //     const getStatusColor = (status) => {
// // //         switch (status.toLowerCase()) {
// // //             case "resolved": return "success";
// // //             case "pending": return "warning";
// // //             case "in progress": return "info";
// // //             case "denied": return "error";
// // //             default: return "default";
// // //         }
// // //     };

// // //     // Calculate filtered reports
// // //     const filteredReports = reports.filter(report => {
// // //         // For IT Admins, only check status filter (type is already filtered in fetchReports)
// // //         if (formData.role === 'it admin') {
// // //             return statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
// // //         }
        
// // //         // For other users, check both type and status filters
// // //         return (typeFilter === 'all' || report.type === typeFilter) &&
// // //                (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase());
// // //     });

// // //     if (loading) {
// // //         return (
// // //             <Container maxWidth="lg" sx={{ py: 4 }}>
// // //                 <Navbar userDetails={formData} />
// // //                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', alignItems: 'center' }}>
// // //                     <CircularProgress size="4rem" />
// // //                     <Typography variant="body1" sx={{ mt: 2 }}>Loading reports...</Typography>
// // //                 </Box>
// // //             </Container>
// // //         );
// // //     }

// // //     if (fetchError) {
// // //         return (
// // //             <Container maxWidth="lg" sx={{ py: 4 }}>
// // //                 <Navbar userDetails={formData} />
// // //                 <Box sx={{ mt: 4, p: 3, bgcolor: '#ffebee', borderRadius: 1 }}>
// // //                     <Typography variant="h6" color="error">Error Loading Reports</Typography>
// // //                     <Typography variant="body1">{fetchError}</Typography>
// // //                     <Button 
// // //                         variant="contained" 
// // //                         color="primary" 
// // //                         onClick={() => {
// // //                             setLoading(true);
// // //                             fetchReports();
// // //                         }}
// // //                         sx={{ mt: 2 }}
// // //                     >
// // //                         Retry
// // //                     </Button>
// // //                 </Box>
// // //             </Container>
// // //         );
// // //     }

// // //     return (
// // //         <Container maxWidth="lg" sx={{ py: 4 }}>
// // //             <Navbar userDetails={formData} />
            
// // //             <Box sx={{ 
// // //                 display: 'flex', 
// // //                 flexDirection: { xs: 'column', md: 'row' }, 
// // //                 justifyContent: 'space-between', 
// // //                 alignItems: 'center', 
// // //                 mb: 3, 
// // //                 gap: 2 
// // //             }}>
// // //                 <Typography variant="h4" component="h1">
// // //                     {formData.role === 'it admin' ? 'IT Maintenance Reports' : 'Report History'}
// // //                 </Typography>
                
// // //                 <Box sx={{ 
// // //                     display: 'flex', 
// // //                     gap: 2, 
// // //                     alignItems: 'center',
// // //                     width: { xs: '100%', md: 'auto' },
// // //                     flexDirection: { xs: 'column', md: 'row' }
// // //                 }}>
// // //                     {/* Only show type filter for non-IT Admins */}
// // //                     {formData.role !== 'it admin' && (
// // //                         <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
// // //                             <InputLabel>Filter by Type</InputLabel>
// // //                             <Select
// // //                                 value={typeFilter}
// // //                                 onChange={(e) => setTypeFilter(e.target.value)}
// // //                                 label="Filter by Type"
// // //                             >
// // //                                 <MenuItem value="all">All Types</MenuItem>
// // //                                 {reportTypes.map((type) => (
// // //                                     <MenuItem key={type} value={type}>{type}</MenuItem>
// // //                                 ))}
// // //                             </Select>
// // //                         </FormControl>
// // //                     )}

// // //                     <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
// // //                         <InputLabel>Filter by Status</InputLabel>
// // //                         <Select
// // //                             value={statusFilter}
// // //                             onChange={(e) => setStatusFilter(e.target.value)}
// // //                             label="Filter by Status"
// // //                         >
// // //                             <MenuItem value="all">All Statuses</MenuItem>
// // //                             {statusOptions.map((status) => (
// // //                                 <MenuItem key={status} value={status}>
// // //                                     {status.charAt(0).toUpperCase() + status.slice(1)}
// // //                                 </MenuItem>
// // //                             ))}
// // //                         </Select>
// // //                     </FormControl>

// // //                     <Button
// // //       variant="contained"
// // //       color="primary"
// // //       onClick={handlePrintAll}
// // //       sx={{ minWidth: 160 }}
// // //     >
// // //       Print All
// // //     </Button>

// // //                     <Button
// // //                         variant="contained"
// // //                         color="primary"
// // //                         onClick={() => {
// // //                             setLoading(true);
// // //                             fetchReports();
// // //                         }}
// // //                         sx={{ 
// // //                             minWidth: 120,
// // //                             width: { xs: '100%', md: 'auto' }
// // //                         }}
// // //                     >
// // //                         Refresh
// // //                     </Button>

// // //                     <Button
// // //                         variant="contained"
// // //                         color="error"
// // //                         startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
// // //                         onClick={handleDeleteAllReports}
// // //                         disabled={isDeletingAll || reports.length === 0}
// // //                         sx={{ 
// // //                             minWidth: 200,
// // //                             width: { xs: '100%', md: 'auto' }
// // //                         }}
// // //                     >
// // //                         {isDeletingAll ? 'Deleting...' : (
// // //                             formData.role === 'admin' ? 'Delete All' : 
// // //                             formData.role === 'it admin' ? 'Delete All IT Reports' : 'Delete Mine'
// // //                         )}
// // //                     </Button>
// // //                 </Box>
// // //             </Box>

// // //             {/* Debug info - remove in production */}
// // //             {/* <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
// // //                 <Typography variant="subtitle2">Debug Info:</Typography>
// // //                 <Typography variant="body2">Role: {formData.role || 'Not set'}</Typography>
// // //                 <Typography variant="body2">User ID: {formData.customUid || 'Not set'}</Typography>
// // //                 <Typography variant="body2">Filter Type: {typeFilter}</Typography>
// // //                 <Typography variant="body2">Total Reports: {reports.length}</Typography>
// // //                 <Typography variant="body2">Filtered Reports: {filteredReports.length}</Typography>
// // //             </Box> */}

// // //             {filteredReports.length === 0 ? (
// // //                 <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
// // //                     {formData.role === 'it admin' ? 'No IT Maintenance reports available.' : 'No reports available.'}
// // //                 </Typography>
// // //             ) : (
// // //                 <Grid container spacing={3}>
// // //                     {filteredReports.map((report) => {
// // //                         const isClickable = ['pending', 'in progress'].includes(report.status.toLowerCase());
                        
// // //                         return (
// // //                             <Grid item xs={12} key={report.id}>
// // //                                 <StyledCard
// // //                                     onClick={() => {
// // //                                         if (isClickable) {
// // //                                             navigate(`/status/${report.pinid}`);
// // //                                         }
// // //                                     }}
// // //                                     sx={{
// // //                                         cursor: isClickable ? 'pointer' : 'default',
// // //                                         '&:hover': {
// // //                                             transform: isClickable ? 'translateY(-4px)' : 'none'
// // //                                         }
// // //                                     }}
// // //                                 >
// // //                                     <Grid container>
// // //                                         <Grid item xs={12} md={4}>
// // //                                             {report.image ? (
// // //                                                 <CardMedia
// // //                                                     component="img"
// // //                                                     height="200"
// // //                                                     image={report.image}
// // //                                                     alt={report.title}
// // //                                                     style={{ cursor: "pointer" }}
// // //                                                     onClick={(e) => {
// // //                                                         e.stopPropagation();
// // //                                                         window.open(report.image, "_blank");
// // //                                                     }}
// // //                                                 />
// // //                                             ) : (
// // //                                                 <Box
// // //                                                     sx={{
// // //                                                         height: 200,
// // //                                                         backgroundColor: "#f0f0f0",
// // //                                                         display: "flex",
// // //                                                         justifyContent: "center",
// // //                                                         alignItems: "center",
// // //                                                         color: "#888",
// // //                                                     }}
// // //                                                 >
// // //                                                     No Image Available
// // //                                                 </Box>
// // //                                             )}
// // //                                         </Grid>
// // //                                         <Grid item xs={12} md={8}>
// // //                                             <CardContent>
// // //                                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
// // //                                                     <Typography variant="h6" component="h2">
// // //                                                         {report.title}
// // //                                                     </Typography>
// // //                                                     <Button
// // //                                                         color="error"
// // //                                                         startIcon={<FaTrash />}
// // //                                                         onClick={(e) => {
// // //                                                             e.stopPropagation();
// // //                                                             handleDeleteReport(report.id);
// // //                                                         }}
// // //                                                     />
// // //                                                 </Box>
// // //                                                 <Typography variant="body1" paragraph>
// // //                                                     {report.details}
// // //                                                 </Typography>
// // //                                                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
// // //                                                     {formData.role === 'admin' && (
// // //                                                         <Chip 
// // //                                                             label={`Priority: ${REPORT_PRIORITY[report.type]?.level || 'Normal'}`}
// // //                                                             color={REPORT_PRIORITY[report.type]?.color || 'default'}
// // //                                                             variant="filled"
// // //                                                         />
// // //                                                     )}
// // //                                                     <Chip label={`Type: ${report.type}`} variant="outlined" />
// // //                                                     <Chip 
// // //                                                         label={`Status: ${report.status}`} 
// // //                                                         color={getStatusColor(report.status)} 
// // //                                                     />
// // //                                                     <Chip label={`Created: ${new Date(report.created_at).toLocaleString()}`} />
// // //                                                     <Chip label={`Reporter: ${report.name}`} />
// // //                                                     <Chip label={`Location: ${report.specific_place}`} />
// // //                                                     <Chip label={`Accepted By: ${report.accepted_by}`} />
// // //                                                 </Box>
// // //                                             </CardContent>
// // //                                         </Grid>
// // //                                     </Grid>
// // //                                 </StyledCard>
// // //                             </Grid>
// // //                         );
// // //                     })}
// // //                 </Grid>
// // //             )}
// // //         </Container>
// // //     );
// // // };

// // // export default History;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     CardMedia,
//     Button,
//     Grid,
//     Container,
//     Chip,
//     Select,
//     MenuItem,
//     InputLabel,
//     FormControl,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { FaTrash, FaRadiation, FaPrint } from "react-icons/fa";
// import { useTheme } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import supabase from "../helper/supabaseClient";
// import CircularProgress from '@mui/material/CircularProgress';
// import { useReactToPrint } from 'react-to-print';

// const REPORT_PRIORITY = {
//     'Caution': { level: 'High', order: 1, color: 'error' },
//     'Electrical': { level: 'High', order: 1, color: 'error' },
//     'Repair': { level: 'Medium', order: 2, color: 'warning' },
//     'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
//     'Cleaning': { level: 'Low', order: 4, color: 'info' },
//     'Request': { level: 'Low', order: 4, color: 'info' }
// };

// const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
//     REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
// );

// const StyledCard = styled(Card)(({ theme }) => ({
//     marginBottom: "1rem",
//     transition: "transform 0.2s",
//     "&:hover": {
//         transform: "translateY(-4px)",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     },
// }));

// // PrintableReport component
// const PrintableReport = ({ report }) => (
//     <div style={{ padding: '20px' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Report Details</h1>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Title:</strong> {report.title}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Details:</strong> {report.details}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Type:</strong> {report.type}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Status:</strong> {report.status}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Location:</strong> {report.specific_place}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Reported By:</strong> {report.name}
//       </div>
//       <div style={{ marginBottom: '15px' }}>
//         <strong>Report Date:</strong> {new Date(report.created_at).toLocaleDateString()}
//       </div>
//       {report.accepted_by && (
//         <div style={{ marginBottom: '15px' }}>
//           <strong>Accepted By:</strong> {report.accepted_by}
//         </div>
//       )}
//       {report.image && (
//         <div style={{ marginTop: '20px' }}>
//           <img 
//             src={report.image} 
//             alt="Report" 
//             style={{ maxWidth: '100%', height: 'auto' }}
//           />
//         </div>
//       )}
//     </div>
// );

// const History = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         lastName: "",
//         email: "",
//         role: "",
//         customUid: "",
//     });

//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isDeletingAll, setIsDeletingAll] = useState(false);
//     const [typeFilter, setTypeFilter] = useState('all');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [fetchError, setFetchError] = useState(null);
//     const [selectedReport, setSelectedReport] = useState(null);

//     const theme = useTheme();
//     const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];
    
//     // Create refs for printing
//     const singleReportRef = useRef(null);
//     const allReportsRef = useRef(null);
  
//     // Handle printing an individual report
//     const handlePrintSingle = useReactToPrint({
//       content: () => singleReportRef.current,
//       onAfterPrint: () => setSelectedReport(null) // Reset after printing
//     });
  
//     // Handle printing all filtered reports
//     const handlePrintAll = useReactToPrint({
//       content: () => allReportsRef.current,
//     });

//     // Fetch user information
//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 console.log("Fetching user info...");
//                 const { data: { user }, error } = await supabase.auth.getUser();
                
//                 if (error) {
//                     console.error('Error fetching user:', error);
//                     setFetchError("Authentication error: " + error.message);
//                     setLoading(false);
//                     return;
//                 }
                
//                 if (!user) {
//                     console.error('No user found');
//                     setFetchError("No authenticated user found");
//                     setLoading(false);
//                     return;
//                 }
                
//                 console.log("User found:", user.id);
                
//                 const { data: userDetails, error: userError } = await supabase
//                     .from('users')
//                     .select('fname, lname, role, id')
//                     .eq('id', user.id)
//                     .single();
                
//                 if (userError) {
//                     console.error('Error fetching user details:', userError);
//                     setFetchError("Error fetching user details: " + userError.message);
//                     setLoading(false);
//                 } else {
//                     console.log("User details found:", userDetails);
//                     setFormData({
//                         name: `${userDetails.fname} ${userDetails.lname}`,
//                         lastName: userDetails.lname,
//                         email: user.email,
//                         role: userDetails.role,
//                         customUid: userDetails.id,
//                     });
//                 }
//             } catch (error) {
//                 console.error("Unexpected error during user fetch:", error);
//                 setFetchError("Unexpected error: " + error.message);
//                 setLoading(false);
//             }
//         };
        
//         fetchUserInfo();
//     }, []);

//     // Set type filter based on role and trigger report fetch when user data is ready
//     useEffect(() => {
//         if (formData.customUid) {
//             console.log("User role detected:", formData.role);
            
//             // Set type filter for IT Admin
//             if (formData.role === 'it admin') {
//                 console.log("Setting filter to IT Maintenance for IT Admin");
//                 setTypeFilter('IT Maintenance');
//             }
            
//             // Fetch reports
//             fetchReports();
//         }
//     }, [formData.customUid, formData.role]);

//     const fetchReports = async () => {
//         try {
//             console.log("Fetching reports for role:", formData.role);
//             setLoading(true);
//             setFetchError(null);
            
//             let query = supabase
//                 .from('reports')
//                 .select('id, title, details, status, type, image, created_at, name, specific_place, pinid, accepted_by')
//                 .order('created_at', { ascending: false });
    
//             // Apply role-based filtering
//             if (formData.role === 'it admin') {
//                 console.log("Applying IT Admin filter: type = IT Maintenance");
//                 query = query.eq('type', 'IT Maintenance');
//             } else if (formData.role !== 'admin') {
//                 console.log("Applying regular user filter: user_uid =", formData.customUid);
//                 query = query.eq('user_uid', formData.customUid);
//             } else {
//                 console.log("No filter for admin role");
//             }
    
//             console.log("Executing query...");
//             const { data: reportsData, error: reportsError } = await query;
    
//             if (reportsError) {
//                 console.error("Error fetching reports:", reportsError);
//                 setFetchError("Error fetching reports: " + reportsError.message);
//                 return;
//             }
    
//             console.log(`Query returned ${reportsData?.length || 0} reports`);
            
//             let sortedReports = reportsData || [];
//             if (formData.role === 'admin' && reportsData) {
//                 console.log("Sorting reports by priority for admin");
//                 sortedReports = [...reportsData].sort((a, b) => {
//                     const priorityA = REPORT_PRIORITY[a.type]?.order || 99;
//                     const priorityB = REPORT_PRIORITY[b.type]?.order || 99;
//                     return priorityA - priorityB;
//                 });
//             }
    
//             setReports(sortedReports);
//         } catch (error) {
//             console.error("Unexpected error fetching reports:", error);
//             setFetchError("Unexpected error: " + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteReport = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this report?")) return;
    
//         try {
//             const { data: reportData, error: reportError } = await supabase
//                 .from('reports')
//                 .select('pinid')
//                 .eq('id', id)
//                 .single();

//             if (reportError) throw reportError;

//             if (reportData.pinid) {
//                 await supabase
//                     .from('pins')
//                     .delete()
//                     .eq('pinid', reportData.pinid);
//             }

//             const { error: reportsError } = await supabase
//                 .from('reports')
//                 .delete()
//                 .eq('id', id);

//             if (reportsError) throw reportsError;

//             setReports(prev => prev.filter(report => report.id !== id));
            
//         } catch (error) {
//             console.error("Deletion failed:", error);
//             alert(`Deletion failed: ${error.message}`);
//         }
//     };

//     const handleDeleteAllReports = async () => {
//         try {
//             const { data: { user }, error: authError } = await supabase.auth.getUser();
//             if (authError || !user) throw new Error("Authentication required");

//             const isAdmin = formData.role === 'admin';
//             const isITAdmin = formData.role === 'it admin';
            
//             let confirmMessage;
//             if (isAdmin) {
//                 confirmMessage = "WARNING: This will delete ALL reports for ALL users! Are you sure?";
//             } else if (isITAdmin) {
//                 confirmMessage = "WARNING: This will delete ALL IT Maintenance reports! Are you sure?";
//             } else {
//                 confirmMessage = "Are you sure you want to delete all YOUR reports? This cannot be undone.";
//             }

//             if (!window.confirm(confirmMessage)) return;

//             setIsDeletingAll(true);

//             let reportsQuery = supabase
//                 .from('reports')
//                 .select('id, pinid, user_uid');

//             if (isITAdmin) {
//                 // IT Admins can only delete IT Maintenance reports
//                 reportsQuery = reportsQuery.eq('type', 'IT Maintenance');
//             } else if (!isAdmin) {
//                 // Regular users can only delete their own reports
//                 reportsQuery = reportsQuery.eq('user_uid', user.id);
//             }
//             // Admins can delete all reports

//             const { data: allReports, error: fetchError } = await reportsQuery;
//             if (fetchError) throw fetchError;

//             if (!allReports || allReports.length === 0) {
//                 let message = "No reports to delete";
//                 if (isITAdmin) message = "No IT Maintenance reports to delete";
//                 if (!isAdmin && !isITAdmin) message = "You have no reports to delete";
                
//                 alert(message);
//                 setIsDeletingAll(false);
//                 return;
//             }

//             const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))];
//             if (pinIds.length > 0) {
//                 await supabase
//                     .from('pins')
//                     .delete()
//                     .in('pinid', pinIds);
//             }

//             const reportIds = allReports.map(report => report.id);
//             await supabase
//                 .from('reports')
//                 .delete()
//                 .in('id', reportIds);

//             setReports([]);
            
//             let successMessage;
//             if (isAdmin) {
//                 successMessage = `Deleted ${reportIds.length} reports and ${pinIds.length} pins successfully!`;
//             } else if (isITAdmin) {
//                 successMessage = `Deleted ${reportIds.length} IT Maintenance reports and ${pinIds.length} pins successfully!`;
//             } else {
//                 successMessage = "Your reports have been deleted successfully";
//             }
            
//             alert(successMessage);

//         } catch (error) {
//             console.error("Deletion failed:", error);
//             alert(`Error: ${error.message}`);
//         } finally {
//             setIsDeletingAll(false);
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//             case "resolved": return "success";
//             case "pending": return "warning";
//             case "in progress": return "info";
//             case "denied": return "error";
//             default: return "default";
//         }
//     };

//     // Calculate filtered reports
//     const filteredReports = reports.filter(report => {
//         // For IT Admins, only check status filter (type is already filtered in fetchReports)
//         if (formData.role === 'it admin') {
//             return statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
//         }
        
//         // For other users, check both type and status filters
//         return (typeFilter === 'all' || report.type === typeFilter) &&
//                (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase());
//     });

//     if (loading) {
//         return (
//             <Container maxWidth="lg" sx={{ py: 4 }}>
//                 <Navbar userDetails={formData} />
//                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', alignItems: 'center' }}>
//                     <CircularProgress size="4rem" />
//                     <Typography variant="body1" sx={{ mt: 2 }}>Loading reports...</Typography>
//                 </Box>
//             </Container>
//         );
//     }

//     if (fetchError) {
//         return (
//             <Container maxWidth="lg" sx={{ py: 4 }}>
//                 <Navbar userDetails={formData} />
//                 <Box sx={{ mt: 4, p: 3, bgcolor: '#ffebee', borderRadius: 1 }}>
//                     <Typography variant="h6" color="error">Error Loading Reports</Typography>
//                     <Typography variant="body1">{fetchError}</Typography>
//                     <Button 
//                         variant="contained" 
//                         color="primary" 
//                         onClick={() => {
//                             setLoading(true);
//                             fetchReports();
//                         }}
//                         sx={{ mt: 2 }}
//                     >
//                         Retry
//                     </Button>
//                 </Box>
//             </Container>
//         );
//     }

//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             <Navbar userDetails={formData} />
            
//             <Box sx={{ 
//                 display: 'flex', 
//                 flexDirection: { xs: 'column', md: 'row' }, 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center', 
//                 mb: 3, 
//                 gap: 2 
//             }}>
//                 <Typography variant="h4" component="h1">
//                     {formData.role === 'it admin' ? 'IT Maintenance Reports' : 'Report History'}
//                 </Typography>
                
//                 <Box sx={{ 
//                     display: 'flex', 
//                     gap: 2, 
//                     alignItems: 'center',
//                     width: { xs: '100%', md: 'auto' },
//                     flexDirection: { xs: 'column', md: 'row' }
//                 }}>
//                     {/* Only show type filter for non-IT Admins */}
//                     {formData.role !== 'it admin' && (
//                         <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
//                             <InputLabel>Filter by Type</InputLabel>
//                             <Select
//                                 value={typeFilter}
//                                 onChange={(e) => setTypeFilter(e.target.value)}
//                                 label="Filter by Type"
//                             >
//                                 <MenuItem value="all">All Types</MenuItem>
//                                 {reportTypes.map((type) => (
//                                     <MenuItem key={type} value={type}>{type}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     )}

//                     <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
//                         <InputLabel>Filter by Status</InputLabel>
//                         <Select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             label="Filter by Status"
//                         >
//                             <MenuItem value="all">All Statuses</MenuItem>
//                             {statusOptions.map((status) => (
//                                 <MenuItem key={status} value={status}>
//                                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handlePrintAll}
//                         sx={{ minWidth: 160 }}
//                         disabled={filteredReports.length === 0}
//                         startIcon={<FaPrint />}
//                     >
//                         Print All
//                     </Button>

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => {
//                             setLoading(true);
//                             fetchReports();
//                         }}
//                         sx={{ 
//                             minWidth: 120,
//                             width: { xs: '100%', md: 'auto' }
//                         }}
//                     >
//                         Refresh
//                     </Button>

//                     <Button
//                         variant="contained"
//                         color="error"
//                         startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
//                         onClick={handleDeleteAllReports}
//                         disabled={isDeletingAll || reports.length === 0}
//                         sx={{ 
//                             minWidth: 200,
//                             width: { xs: '100%', md: 'auto' }
//                         }}
//                     >
//                         {isDeletingAll ? 'Deleting...' : (
//                             formData.role === 'admin' ? 'Delete All' : 
//                             formData.role === 'it admin' ? 'Delete All IT Reports' : 'Delete Mine'
//                         )}
//                     </Button>
//                 </Box>
//             </Box>

//             {filteredReports.length === 0 ? (
//                 <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
//                     {formData.role === 'it admin' ? 'No IT Maintenance reports available.' : 'No reports available.'}
//                 </Typography>
//             ) : (
//                 <Grid container spacing={3}>
//                     {filteredReports.map((report) => {
//                         const isClickable = ['pending', 'in progress'].includes(report.status.toLowerCase());
                        
//                         return (
//                             <Grid item xs={12} key={report.id}>
//                                 <StyledCard
//                                     onClick={() => {
//                                         if (isClickable) {
//                                             navigate(`/status/${report.pinid}`);
//                                         }
//                                     }}
//                                     sx={{
//                                         cursor: isClickable ? 'pointer' : 'default',
//                                         '&:hover': {
//                                             transform: isClickable ? 'translateY(-4px)' : 'none'
//                                         }
//                                     }}
//                                 >
//                                     <Grid container>
//                                         <Grid item xs={12} md={4}>
//                                             {report.image ? (
//                                                 <CardMedia
//                                                     component="img"
//                                                     height="200"
//                                                     image={report.image}
//                                                     alt={report.title}
//                                                     style={{ cursor: "pointer" }}
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         window.open(report.image, "_blank");
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <Box
//                                                     sx={{
//                                                         height: 200,
//                                                         backgroundColor: "#f0f0f0",
//                                                         display: "flex",
//                                                         justifyContent: "center",
//                                                         alignItems: "center",
//                                                         color: "#888",
//                                                     }}
//                                                 >
//                                                     No Image Available
//                                                 </Box>
//                                             )}
//                                         </Grid>
//                                         <Grid item xs={12} md={8}>
//                                             <CardContent>
//                                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
//                                                     <Typography variant="h6" component="h2">
//                                                         {report.title}
//                                                     </Typography>
//                                                     <Box>
//                                                         <Button
//                                                             color="primary"
//                                                             startIcon={<FaPrint />}
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setSelectedReport(report);
//                                                                 setTimeout(() => handlePrintSingle(), 100);
//                                                             }}
//                                                             sx={{ mr: 1 }}
//                                                             aria-label="Print report"
//                                                             title="Print this report"
//                                                         />
//                                                         <Button
//                                                             color="error"
//                                                             startIcon={<FaTrash />}
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 handleDeleteReport(report.id);
//                                                             }}
//                                                             aria-label="Delete report"
//                                                             title="Delete this report"
//                                                         />
//                                                     </Box>
//                                                 </Box>
//                                                 <Typography variant="body1" paragraph>
//                                                     {report.details}
//                                                 </Typography>
//                                                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                                                     {formData.role === 'admin' && (
//                                                         <Chip 
//                                                             label={`Priority: ${REPORT_PRIORITY[report.type]?.level || 'Normal'}`}
//                                                             color={REPORT_PRIORITY[report.type]?.color || 'default'}
//                                                             variant="filled"
//                                                         />
//                                                     )}
//                                                     <Chip label={`Type: ${report.type}`} variant="outlined" />
//                                                     <Chip 
//                                                         label={`Status: ${report.status}`} 
//                                                         color={getStatusColor(report.status)} 
//                                                     />
//                                                     <Chip label={`Created: ${new Date(report.created_at).toLocaleString()}`} />
//                                                     <Chip label={`Reporter: ${report.name}`} />
//                                                     <Chip label={`Location: ${report.specific_place}`} />
//                                                     {report.accepted_by && (
//                                                         <Chip label={`Accepted By: ${report.accepted_by}`} />
//                                                     )}
//                                                 </Box>
//                                             </CardContent>
//                                         </Grid>
//                                     </Grid>
//                                 </StyledCard>
//                             </Grid>
//                         );
//                     })}
//                 </Grid>
//             )}

//             {/* Hidden printable components */}
            
//             {/* Single Report Print Component */}
//             <div style={{ display: 'none' }}>
//                 <div ref={singleReportRef}>
//                     {selectedReport && <PrintableReport report={selectedReport} />}
//                 </div>
//             </div>

//             {/* All Reports Print Component */}
//             <div style={{ display: 'none' }}>
//                 <div ref={allReportsRef}>
//                     <div style={{ padding: '20px' }}>
//                         <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
//                             {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''}
//                         </h1>
//                         {filteredReports.map((report, index) => (
//                             <div key={report.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid', pageBreakAfter: index < filteredReports.length - 1 ? 'always' : 'auto' }}>
//                                 <h2>Report #{index + 1}</h2>
//                                 <PrintableReport report={report} />
//                                 {index < filteredReports.length - 1 && (
//                                     <hr style={{ margin: '20px 0' }} />
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </Container>
//     );
// };

// export default History;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     CardMedia,
//     Button,
//     Grid,
//     Container,
//     Chip,
//     Select,
//     MenuItem,
//     InputLabel,
//     FormControl,
//     Modal,
//     IconButton
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { FaTrash, FaRadiation, FaPrint, FaTimes } from "react-icons/fa";
// import { useTheme } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import supabase from "../helper/supabaseClient";
// import CircularProgress from '@mui/material/CircularProgress';
// import { pdf } from '@react-pdf/renderer';
// import { PDFReport, MultiPDFReport } from '../helper/PDFReport';

// const REPORT_PRIORITY = {
//     'Caution': { level: 'High', order: 1, color: 'error' },
//     'Electrical': { level: 'High', order: 1, color: 'error' },
//     'Repair': { level: 'Medium', order: 2, color: 'warning' },
//     'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
//     'Cleaning': { level: 'Low', order: 4, color: 'info' },
//     'Request': { level: 'Low', order: 4, color: 'info' }
// };

// const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
//     REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
// );

// const StyledCard = styled(Card)(({ theme }) => ({
//     marginBottom: "1rem",
//     transition: "transform 0.2s",
//     "&:hover": {
//         transform: "translateY(-4px)",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     },
// }));

// const History = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         lastName: "",
//         email: "",
//         role: "",
//         customUid: "",
//     });
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isDeletingAll, setIsDeletingAll] = useState(false);
//     const [typeFilter, setTypeFilter] = useState('all');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [fetchError, setFetchError] = useState(null);
//     const [isPrinting, setIsPrinting] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);

//     const theme = useTheme();
//     const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];

//     const handleImageClick = (imageUrl) => {
//         setSelectedImage(imageUrl);
//     };

//     const handleCloseImageModal = () => {
//         setSelectedImage(null);
//     };

//     const handleExportSinglePDF = async (report) => {
//         setIsPrinting(true);
//         try {
//             const blob = await pdf(<PDFReport report={report} />).toBlob();
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `Report-${report.id}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         } finally {
//             setIsPrinting(false);
//         }
//     };

//     const handleExportAllPDF = async () => {
//         setIsPrinting(true);
//         try {
//             const blob = await pdf(<MultiPDFReport reports={filteredReports} />).toBlob();
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `All-Reports-${Date.now()}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         } finally {
//             setIsPrinting(false);
//         }
//     };

//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 const { data: { user }, error } = await supabase.auth.getUser();
//                 if (error || !user) {
//                     setFetchError(error?.message || "No authenticated user");
//                     setLoading(false);
//                     return;
//                 }

//                 const { data: userDetails } = await supabase
//                     .from('users')
//                     .select('fname, lname, role, id')
//                     .eq('id', user.id)
//                     .single();

//                 setFormData({
//                     name: `${userDetails.fname} ${userDetails.lname}`,
//                     lastName: userDetails.lname,
//                     email: user.email,
//                     role: userDetails.role,
//                     customUid: userDetails.id,
//                 });
//             } catch (error) {
//                 setFetchError(error.message);
//                 setLoading(false);
//             }
//         };
//         fetchUserInfo();
//     }, []);

//     useEffect(() => {
//         if (formData.customUid) {
//             if (formData.role === 'it admin') setTypeFilter('IT Maintenance');
//             fetchReports();
//         }
//     }, [formData.customUid, formData.role]);

//     const fetchReports = async () => {
//         try {
//             setLoading(true);
//             let query = supabase
//                 .from('reports')
//                 .select('*')
//                 .order('created_at', { ascending: false });

//             if (formData.role === 'it admin') {
//                 query = query.eq('type', 'IT Maintenance');
//             } else if (formData.role !== 'admin') {
//                 query = query.eq('user_uid', formData.customUid);
//             }

//             const { data: reportsData } = await query;
//             const sortedReports = formData.role === 'admin' 
//                 ? [...(reportsData || [])].sort((a, b) => 
//                     (REPORT_PRIORITY[a.type]?.order || 99) - (REPORT_PRIORITY[b.type]?.order || 99)
//                   )
//                 : reportsData || [];

//             setReports(sortedReports);
//         } catch (error) {
//             setFetchError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteReport = async (reportId) => {
//         try {
//             const { error } = await supabase
//                 .from('reports')
//                 .delete()
//                 .eq('id', reportId);

//             if (!error) {
//                 setReports(reports.filter(report => report.id !== reportId));
//             }
//         } catch (error) {
//             console.error('Error deleting report:', error);
//         }
//     };

//     const handleDeleteAllReports = async () => {
//         setIsDeletingAll(true);
//         try {
//             const { error } = await supabase
//                 .from('reports')
//                 .delete()
//                 .neq('id', 0);

//             if (!error) {
//                 setReports([]);
//             }
//         } catch (error) {
//             console.error('Error deleting all reports:', error);
//         } finally {
//             setIsDeletingAll(false);
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//             case "resolved": return "success";
//             case "pending": return "warning";
//             case "in progress": return "info";
//             case "denied": return "error";
//             default: return "default";
//         }
//     };

//     const filteredReports = reports.filter(report => {
//         if (formData.role === 'it admin') {
//             return statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
//         }
//         return (typeFilter === 'all' || report.type === typeFilter) &&
//                (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase());
//     });

//     if (loading) {
//         return (
//             <Container maxWidth="lg" sx={{ py: 4 }}>
//                 <Navbar userDetails={formData} />
//                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                     <CircularProgress size="4rem" />
//                 </Box>
//             </Container>
//         );
//     }

//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             <Navbar userDetails={formData} />
            
//             <Modal
//                 open={Boolean(selectedImage)}
//                 onClose={handleCloseImageModal}
//                 aria-labelledby="image-preview-modal"
//                 aria-describedby="full-size-image-preview"
//             >
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     p: 2,
//                     outline: 'none',
//                     maxWidth: '90vw',
//                     maxHeight: '90vh',
//                 }}>
//                     <IconButton
//                         aria-label="close"
//                         onClick={handleCloseImageModal}
//                         sx={{
//                             position: 'absolute',
//                             right: 8,
//                             top: 8,
//                             color: (theme) => theme.palette.grey[500],
//                         }}
//                     >
//                         <FaTimes />
//                     </IconButton>
//                     <img
//                         src={selectedImage}
//                         alt="Full size preview"
//                         style={{
//                             maxWidth: '100%',
//                             maxHeight: '80vh',
//                             display: 'block',
//                             margin: 'auto',
//                         }}
//                     />
//                 </Box>
//             </Modal>

//             <Box sx={{ 
//                 display: 'flex', 
//                 flexDirection: { xs: 'column', md: 'row' }, 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center', 
//                 mb: 3, 
//                 gap: 2 
//             }}>
//                 <Typography variant="h4" component="h1">
//                     {formData.role === 'it admin' ? 'IT Maintenance Reports' : 'Report History'}
//                 </Typography>
                
//                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                     {formData.role !== 'it admin' && (
//                         <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
//                             <InputLabel>Filter by Type</InputLabel>
//                             <Select
//                                 value={typeFilter}
//                                 onChange={(e) => setTypeFilter(e.target.value)}
//                                 label="Filter by Type"
//                             >
//                                 <MenuItem value="all">All Types</MenuItem>
//                                 {reportTypes.map((type) => (
//                                     <MenuItem key={type} value={type}>{type}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     )}

//                     <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
//                         <InputLabel>Filter by Status</InputLabel>
//                         <Select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             label="Filter by Status"
//                         >
//                             <MenuItem value="all">All Statuses</MenuItem>
//                             {statusOptions.map((status) => (
//                                 <MenuItem key={status} value={status}>
//                                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleExportAllPDF}
//                         disabled={filteredReports.length === 0 || isPrinting}
//                         startIcon={<FaPrint />}
//                     >
//                         {isPrinting ? 'Generating...' : 'Export All as PDF'}
//                     </Button>

//                     <Button
//                         variant="contained"
//                         color="error"
//                         startIcon={isDeletingAll ? <CircularProgress size={20} /> : <FaRadiation />}
//                         onClick={handleDeleteAllReports}
//                         disabled={isDeletingAll || reports.length === 0}
//                     >
//                         {isDeletingAll ? 'Deleting...' : 'Delete All'}
//                     </Button>
//                 </Box>
//             </Box>

//             {filteredReports.length === 0 ? (
//                 <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
//                     {formData.role === 'it admin' ? 'No IT Maintenance reports' : 'No reports available'}
//                 </Typography>
//             ) : (
//                 <Grid container spacing={3}>
//                     {filteredReports.map((report) => (
//                         <Grid item xs={12} key={report.id}>
//                             <StyledCard>
//                                 <CardContent>
//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <Typography variant="h6" component="div">
//                                             {report.title}
//                                         </Typography>
//                                         <Box sx={{ display: 'flex', gap: 1 }}>
//                                             <Chip 
//                                                 label={report.type}
//                                                 color={REPORT_PRIORITY[report.type]?.color || 'default'}
//                                                 size="small"
//                                             />
//                                             <Chip 
//                                                 label={report.status}
//                                                 color={getStatusColor(report.status)}
//                                                 size="small"
//                                             />
//                                         </Box>
//                                     </Box>
//                                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                                         {report.details}
//                                     </Typography>
//                                     {report.image && (
//                                         <CardMedia
//                                             component="img"
//                                             height="140"
//                                             image={report.image}
//                                             alt="Report image"
//                                             sx={{ 
//                                                 mt: 2, 
//                                                 borderRadius: 1,
//                                                 cursor: 'pointer',
//                                                 transition: 'transform 0.3s ease',
//                                                 '&:hover': {
//                                                     transform: 'scale(1.03)',
//                                                 }
//                                             }}
//                                             onClick={() => handleImageClick(report.image)}
//                                         />
//                                     )}
//                                     <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Reported by {report.name} • {new Date(report.created_at).toLocaleDateString()}
//                                         </Typography>
//                                         <Box sx={{ display: 'flex', gap: 1 }}>
//                                             <Button
//                                                 startIcon={<FaPrint />}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleExportSinglePDF(report);
//                                                 }}
//                                                 disabled={isPrinting}
//                                             >
//                                                 Export PDF
//                                             </Button>
//                                             <Button
//                                                 startIcon={<FaTrash />}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleDeleteReport(report.id);
//                                                 }}
//                                                 color="error"
//                                             >
//                                                 Delete
//                                             </Button>
//                                         </Box>
//                                     </Box>
//                                 </CardContent>
//                             </StyledCard>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//         </Container>
//     );
// };

// export default History;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Container,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Modal,
    IconButton,
    useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import { FaTrash, FaRadiation, FaPrint, FaTimes } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import supabase from "../helper/supabaseClient";
import CircularProgress from '@mui/material/CircularProgress';
import { pdf } from '@react-pdf/renderer';
import { PDFReport, MultiPDFReport } from '../helper/PDFReport';

const REPORT_PRIORITY = {
    'Caution': { level: 'High', order: 1, color: 'error' },
    'Electrical': { level: 'High', order: 1, color: 'error' },
    'Repair': { level: 'Medium', order: 2, color: 'warning' },
    'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
    'Cleaning': { level: 'Low', order: 4, color: 'info' },
    'Request': { level: 'Low', order: 4, color: 'info' }
};

const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
    REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
);

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: "1rem",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
}));

const History = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        role: "",
        customUid: "",
    });
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fetchError, setFetchError] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseImageModal = () => {
        setSelectedImage(null);
    };

    // const handleExportSinglePDF = async (report) => {
    //     setIsPrinting(true);
    //     try {
    //         const blob = await pdf(<PDFReport report={report} />).toBlob();
    //         const url = URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = `Report-${report.id}.pdf`;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //     } finally {
    //         setIsPrinting(false);
    //     }
    // };

    // const handleExportAllPDF = async () => {
    //     setIsPrinting(true);
    //     try {
    //         const blob = await pdf(<MultiPDFReport reports={filteredReports} />).toBlob();
    //         const url = URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = `All-Reports-${Date.now()}.pdf`;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         URL.revoObjectURL(url);
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //     } finally {
    //         setIsPrinting(false);
    //     }
    // };

    const handleExportSinglePDF = async (report) => {
        setIsPrinting(true);
        try {
            if (!report) {
                console.error('Error: Report is undefined');
                return;
            }
            
            // Create a safe report object with fallback values for any potentially missing properties
            const safeReport = {
                ...report,
                title: report.title || 'No Title',
                details: report.details || 'No Details',
                type: report.type || 'Unknown Type',
                status: report.status || 'Unknown Status',
                specific_place: report.specific_place || 'Not Specified',
                name: report.name || 'Unknown Reporter',
                created_at: report.created_at || new Date().toISOString(),
                // Don't include image if it's not available or is an empty string
                image: report.image && report.image.trim() ? report.image : null
            };
            
            const blob = await pdf(<PDFReport report={safeReport} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Report-${report.id || 'unknown'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsPrinting(false);
        }
    };
    
    const handleExportAllPDF = async () => {
        setIsPrinting(true);
        try {
            if (!filteredReports || filteredReports.length === 0) {
                console.error('No reports to export');
                return;
            }
            
            // Create safe report objects for each report
            const safeReports = filteredReports.map(report => ({
                ...report,
                title: report.title || 'No Title',
                details: report.details || 'No Details',
                type: report.type || 'Unknown Type',
                status: report.status || 'Unknown Status',
                specific_place: report.specific_place || 'Not Specified',
                name: report.name || 'Unknown Reporter',
                created_at: report.created_at || new Date().toISOString(),
                // Don't include image if it's not available or is an empty string
                image: report.image && report.image.trim() ? report.image : null
            }));
            
            const blob = await pdf(<MultiPDFReport reports={safeReports} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `All-Reports-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsPrinting(false);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                    setFetchError(error?.message || "No authenticated user");
                    setLoading(false);
                    return;
                }

                const { data: userDetails } = await supabase
                    .from('users')
                    .select('fname, lname, role, id')
                    .eq('id', user.id)
                    .single();

                setFormData({
                    name: `${userDetails.fname} ${userDetails.lname}`,
                    lastName: userDetails.lname,
                    email: user.email,
                    role: userDetails.role,
                    customUid: userDetails.id,
                });
            } catch (error) {
                setFetchError(error.message);
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (formData.customUid) {
            if (formData.role === 'it admin') setTypeFilter('IT Maintenance');
            fetchReports();
        }
    }, [formData.customUid, formData.role]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (formData.role === 'it admin') {
                query = query.eq('type', 'IT Maintenance');
            } else if (formData.role !== 'admin') {
                query = query.eq('user_uid', formData.customUid);
            }

            const { data: reportsData } = await query;
            const sortedReports = formData.role === 'admin' 
                ? [...(reportsData || [])].sort((a, b) => 
                    (REPORT_PRIORITY[a.type]?.order || 99) - (REPORT_PRIORITY[b.type]?.order || 99)
                  )
                : reportsData || [];

            setReports(sortedReports);
        } catch (error) {
            setFetchError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .eq('id', reportId);

            if (!error) {
                setReports(reports.filter(report => report.id !== reportId));
            }
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    const handleDeleteAllReports = async () => {
        setIsDeletingAll(true);
        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .neq('id', 0);

            if (!error) {
                setReports([]);
            }
        } catch (error) {
            console.error('Error deleting all reports:', error);
        } finally {
            setIsDeletingAll(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved": return "success";
            case "pending": return "warning";
            case "in progress": return "info";
            case "denied": return "error";
            default: return "default";
        }
    };

    const filteredReports = reports.filter(report => {
        if (formData.role === 'it admin') {
            return statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
        }
        return (typeFilter === 'all' || report.type === typeFilter) &&
               (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase());
    });

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Navbar userDetails={formData} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress size="4rem" />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
            <Navbar userDetails={formData} />
            
            <Modal
                open={Boolean(selectedImage)}
                onClose={handleCloseImageModal}
                aria-labelledby="image-preview-modal"
                aria-describedby="full-size-image-preview"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    outline: 'none',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseImageModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 1,
                        }}
                    >
                        <FaTimes />
                    </IconButton>
                    <img
                        src={selectedImage}
                        alt="Full size preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            display: 'block',
                            margin: 'auto',
                        }}
                    />
                </Box>
            </Modal>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' }, 
                mb: 3, 
                gap: 2 
            }}>
                <Typography variant="h4" component="h1" sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                }}>
                    {formData.role === 'it admin' ? 'IT Maintenance Reports' : 'Report History'}
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 2, 
                    alignItems: { xs: 'stretch', sm: 'center' },
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    {formData.role !== 'it admin' && (
                        <FormControl variant="outlined" size="small" sx={{ 
                            minWidth: { xs: '100%', sm: 180 } 
                        }}>
                            <InputLabel>Filter by Type</InputLabel>
                            <Select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                label="Filter by Type"
                                fullWidth
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                {reportTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl variant="outlined" size="small" sx={{ 
                        minWidth: { xs: '100%', sm: 180 } 
                    }}>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Filter by Status"
                            fullWidth
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExportAllPDF}
                            disabled={filteredReports.length === 0 || isPrinting}
                            startIcon={<FaPrint />}
                            fullWidth={isMobile}
                            size={isMobile ? "medium" : "medium"}
                        >
                            {isPrinting ? 'Generating...' : isMobile ? 'Export All' : 'Export All as PDF'}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={isDeletingAll ? <CircularProgress size={20} /> : <FaRadiation />}
                            onClick={handleDeleteAllReports}
                            disabled={isDeletingAll || reports.length === 0}
                            fullWidth={isMobile}
                            size={isMobile ? "medium" : "medium"}
                        >
                            {isDeletingAll ? 'Deleting...' : 'Delete All'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {filteredReports.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
                    {formData.role === 'it admin' ? 'No IT Maintenance reports' : 'No reports available'}
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredReports.map((report) => (
                        <Grid item xs={12} key={report.id}>
                            <StyledCard>
                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between', 
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: { xs: 1, sm: 0 }
                                    }}>
                                        <Typography variant="h6" component="div" sx={{
                                            fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}>
                                            {report.title}
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            gap: 1,
                                            flexWrap: 'wrap',
                                            mt: { xs: 1, sm: 0 }
                                        }}>
                                            <Chip 
                                                label={report.type}
                                                color={REPORT_PRIORITY[report.type]?.color || 'default'}
                                                size="small"
                                            />
                                            <Chip 
                                                label={report.status}
                                                color={getStatusColor(report.status)}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {report.details}
                                    </Typography>
                                    {report.image && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={report.image}
                                            alt="Report image"
                                            sx={{ 
                                                mt: 2, 
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.03)',
                                                }
                                            }}
                                            onClick={() => handleImageClick(report.image)}
                                        />
                                    )}
                                    <Box sx={{ 
                                        mt: 2, 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between', 
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: { xs: 2, sm: 0 }
                                    }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Reported by {report.name} • {new Date(report.created_at).toLocaleDateString()}
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            gap: 1,
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            width: { xs: '100%', sm: 'auto' }
                                        }}>
                                            <Button
                                                startIcon={<FaPrint />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleExportSinglePDF(report);
                                                }}
                                                disabled={isPrinting}
                                                fullWidth={isMobile}
                                                size={isMobile ? "small" : "medium"}
                                                variant={isMobile ? "outlined" : "text"}
                                            >
                                                {isMobile ? 'Export' : 'Export PDF'}
                                            </Button>
                                            <Button
                                                startIcon={<FaTrash />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteReport(report.id);
                                                }}
                                                color="error"
                                                fullWidth={isMobile}
                                                size={isMobile ? "small" : "medium"}
                                                variant={isMobile ? "outlined" : "text"}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default History;