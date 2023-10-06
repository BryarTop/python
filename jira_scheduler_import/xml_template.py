def make_header():
    return(f'\
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n \
<TheSchedulerBackup xmlns="http://www.tt.com.pl">\n\
    <BackupInformation>\n\
        <JiraVersion>version</JiraVersion>\n\
        <PluginVersion>pluginVersion</PluginVersion>\n\
        <BackupVersion>bakVersion</BackupVersion>\n\
        <BackupCreator>currentUser</BackupCreator>\n\
        <BackupTime>bakTime</BackupTime>\n\
        <ExportType>selected</ExportType>\n\
        <SelectedProjects>12641</SelectedProjects>\n\
        <SkipDisabled>false</SkipDisabled>\n\
        <SkipInvalid>false</SkipInvalid>\n\
    </BackupInformation>\n\
')


def make_footer():
 return(f'\
            <SharedSIElement>\n\
                <sharedToEveryone>false</sharedToEveryone>\n\
                <sharedToLead>false</sharedToLead>\n\
                <sharedGroups></sharedGroups>\n\
                <sharedUsers>stephanie.soules</sharedUsers>\n\
                <sharedRoles>Administrators</sharedRoles>\n\
            </SharedSIElement>\n\
            <createLinked>0</createLinked>\n\
            <issueLinkTypeId>10220</issueLinkTypeId>\n\
            <createAsSubtask>false</createAsSubtask>\n\
            <parentIssueId>0</parentIssueId>\n\
        </ScheduledIssueElement>\n\
    </TheSchedulerData>\n\
</TheSchedulerBackup>\n'
)

def make_scheduled_issue_info(sched_issue_name):
    return(f'\
    <ScheduledIssueElement>\n\
        <name>{sched_issue_name}</name>\n\
        <createdBy>JIRAUSER16847</createdBy>\n\
        <description></description>\n\
        <projectId>12641</projectId>\n\
        <issueType>3</issueType>\n\
        <disabled>flase</disabled>\n\
        <increasePriority>false</increasePriority>\n\
        <createWhenResolution>true</createWhenResolution>\n\
        <createWhenPriorityHasMaxValue>false</createWhenPriorityHasMaxValue>\n')

def make_interval(start_date, monthly_interval):
    return(f'\
        <TriggerElement>\n\
            <triggerType>INTERVAL</triggerType>\n\
            <timeZoneID>Amercia/Denver</timeZoneID>\n\
            <intervalType>MONTHLY</intervalType>\n\
            <intervalDivider>{monthly_interval}</intervalDivider>\n\
            <startDate>{start_date}</startDate>\n\
            <skipScheduledExecutionAfterManual>false</skipScheduledExecutionAfterManual>\n\
        </TriggerElement>')

def field_element_helper(name,class_name):
    return(f'\
        <FieldElement>\n\
            <fieldName>customfield_{name}</fieldName>\n\
            <fieldClassName>com.atlassian.jira.issue.fields.{class_name}</fieldClassName>\n\
        </FieldElement>\n')


def define_body_elements():
    identical_fields = ['16392','17443','17442','14096','17441',
        '17447','14653','17446','13443','17445','14651','13522','13444',
        '14726','13514','13517','16749','16803','13519','16386','14443',
        '18328','13430','16388','17439','13499','14028']
    
    system_field_names = [
      {'name':'description','value':'DescriptionSystemField'},
      {'name':'attachment','value':'AttachmentSystemField'},
      {'name':'summary', 'value':'SummarySystemField'},
      {'name':'reporter','value':'ReporterSystemField'},
      {'name':'duedate','value':'DueDateSystemField'}
    ]
    system_field_indeces = [6,19,21,26,31]
    body_element = []
    for i in identical_fields:
        body_element.append(field_element_helper(i,'ImmutableCustomField'))
   
    sys_field_idx = 0
    for idx in system_field_indeces:
        body_element.insert(idx,field_element_helper(
            system_field_names[sys_field_idx]['name'],
            system_field_names[sys_field_idx]['value'],
        ))
        sys_field_idx+=1

    return(''.join(body_element))
   
def define_body_params(
    
)
#to-do
## create a tester spec with all of the possible fields updated. 
