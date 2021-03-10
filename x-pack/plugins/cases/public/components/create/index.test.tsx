/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act, waitFor } from '@testing-library/react';
import { noop } from 'lodash/fp';
import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';

import { TestProviders } from '../../common/mock';
import { useGetTags } from '../../containers/use_get_tags';
import { useConnectors } from '../../containers/configure/use_connectors';
import { useCaseConfigure } from '../../containers/configure/use_configure';
import { useGetIncidentTypes } from '../connectors/resilient/use_get_incident_types';
import { useGetSeverity } from '../connectors/resilient/use_get_severity';
import { useGetIssueTypes } from '../connectors/jira/use_get_issue_types';
import { useGetFieldsByIssueType } from '../connectors/jira/use_get_fields_by_issue_type';
import { useCaseConfigureResponse } from '../configure_cases/__mock__';
import {
  sampleConnectorData,
  sampleData,
  sampleTags,
  useGetIncidentTypesResponse,
  useGetSeverityResponse,
  useGetIssueTypesResponse,
  useGetFieldsByIssueTypeResponse,
} from './mock';
import { CreateCase } from '.';

jest.mock('../../containers/api');
jest.mock('../../containers/use_get_tags');
jest.mock('../../containers/configure/use_connectors');
jest.mock('../../containers/configure/use_configure');
jest.mock('../connectors/resilient/use_get_incident_types');
jest.mock('../connectors/resilient/use_get_severity');
jest.mock('../connectors/jira/use_get_issue_types');
jest.mock('../connectors/jira/use_get_fields_by_issue_type');
jest.mock('../connectors/jira/use_get_single_issue');
jest.mock('../connectors/jira/use_get_issues');
jest.mock('../use_insert_timeline');

const useConnectorsMock = useConnectors as jest.Mock;
const useCaseConfigureMock = useCaseConfigure as jest.Mock;
const useGetTagsMock = useGetTags as jest.Mock;
const useGetIncidentTypesMock = useGetIncidentTypes as jest.Mock;
const useGetSeverityMock = useGetSeverity as jest.Mock;
const useGetIssueTypesMock = useGetIssueTypes as jest.Mock;
const useGetFieldsByIssueTypeMock = useGetFieldsByIssueType as jest.Mock;
const fetchTags = jest.fn();

const fillForm = (wrapper: ReactWrapper) => {
  wrapper
    .find(`[data-test-subj="caseTitle"] input`)
    .first()
    .simulate('change', { target: { value: sampleData.title } });

  wrapper
    .find(`[data-test-subj="caseDescription"] textarea`)
    .first()
    .simulate('change', { target: { value: sampleData.description } });

  act(() => {
    ((wrapper.find(EuiComboBox).props() as unknown) as {
      onChange: (a: EuiComboBoxOptionOption[]) => void;
    }).onChange(sampleTags.map((tag) => ({ label: tag })));
  });
};

describe('CreateCase case', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
    useConnectorsMock.mockReturnValue(sampleConnectorData);
    useCaseConfigureMock.mockImplementation(() => useCaseConfigureResponse);
    useGetIncidentTypesMock.mockReturnValue(useGetIncidentTypesResponse);
    useGetSeverityMock.mockReturnValue(useGetSeverityResponse);
    useGetIssueTypesMock.mockReturnValue(useGetIssueTypesResponse);
    useGetFieldsByIssueTypeMock.mockReturnValue(useGetFieldsByIssueTypeResponse);
    useGetTagsMock.mockImplementation(() => ({
      tags: sampleTags,
      fetchTags,
    }));
  });

  it('it renders', async () => {
    const wrapper = mount(
      <TestProviders>
        <CreateCase />
      </TestProviders>
    );

    expect(wrapper.find(`[data-test-subj="create-case-submit"]`).exists()).toBeTruthy();
    expect(wrapper.find(`[data-test-subj="create-case-cancel"]`).exists()).toBeTruthy();
  });

  it('should redirect to all cases on cancel click', async () => {
    const wrapper = mount(
      <TestProviders>
        <CreateCase />
      </TestProviders>
    );

    wrapper.find(`[data-test-subj="create-case-cancel"]`).first().simulate('click');
    await waitFor(() => expect(mockHistory.push).toHaveBeenCalledWith('/'));
  });

  it('should redirect to new case when posting the case', async () => {
    const wrapper = mount(
      <TestProviders>
        <CreateCase />
      </TestProviders>
    );

    fillForm(wrapper);
    wrapper.find(`[data-test-subj="create-case-submit"]`).first().simulate('click');
  });

  it('it should insert a timeline', async () => {
    const attachTimeline = noop;

    const wrapper = mount(
      <TestProviders>
        <CreateCase />
      </TestProviders>
    );

    act(() => {
      attachTimeline('[title](url)');
    });

    await waitFor(() => {
      expect(wrapper.find(`[data-test-subj="caseDescription"] textarea`).text()).toBe(
        '[title](url)'
      );
    });
  });
});
